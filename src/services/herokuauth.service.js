import fetch from 'node-fetch';
import config from 'config';
import * as encryptUtil from '../utils/encryption';
import * as herokuService from '../services/heroku.service';
import HerokuTokenNotFoundException from '../error/HerokuTokenNotFoundException';

export default class HerokuAuthService {
  constructor(herokuCredentialsRepository, userService, logger) {
    this.herokuCredentialsRepository = herokuCredentialsRepository;
    this.userService = userService;
    this.log = logger;
  }

  /**
   * Checks if the user is authenticated on Heroku. If the user is not authenticated, then it
   * will return false. Otherwise, return true. If the user is not authenticated, it will delete
   * the token if it currently exists.
   * @param userId
   * @returns {Boolean} returns true if the user is authenticated, false otherwise.
   */
  async checkIfUserIsAuthenticatedOnHeroku(userId) {
    const token = await this.getHerokuTokenForUser(userId);
    if (token) {
      const isAuthenticatedOnHeroku =
        await herokuService.checkIfUserIsAuthenticated(token);

      // if the user is authenticated on heroku, return true
      if (isAuthenticatedOnHeroku) {
        return true;
      }

      // remove the token if there was one in the DB, but was not valid on heroku.
      await this.deleteHerokuTokenForUser(userId);
    }

    return false;
  }

  /**
   * Gets the decrypted heroku token for a user
   * @param userId the user id to get the token for
   * @returns {String} the token or null
   */
  async getHerokuTokenForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getHerokuCredentials();
    if (token[0]) {
      return encryptUtil.decrypt(token[0].token);
    }

    return null;
  }

  /**
   * Gets the decrypted heroku token for a user
   * @param userId the user id to get the token for
   * @returns {String} the token or null
   */
  async getHerokuTokenAndEmailForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getHerokuCredentials();
    if (token[0]) {
      // TODO: apiKey should later be changed to token when tyr is changed to look for token
      return { apiKey: encryptUtil.decrypt(token[0].token), email: token[0].email };
    }

    throw new HerokuTokenNotFoundException(`Heroku Token for user with id ${userId} does not exist.`);
  }

  /**
   * Gets the email tied to the user
   * @param userId the user id to get the token for
   * @returns {String} the token or null
   */
  async getHerokuEmailForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getHerokuCredentials();
    if (token[0]) {
      return token[0].email;
    }

    return null;
  }

  /**
   * Gets the Heroku token a user. If the token exists, it will return the token, otherwise it
   * will return null.
   * @param userId the user id to get the token for
   * @returns {Object} the token or null
   */
  async getSequelizeHerokuTokenForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getHerokuCredentials();
    if (token) {
      return token[0];
    }

    return null;
  }

  /**
   * Adds the Heroku token for a user. If the user already has a token, it will update the
   * existing one. If the user does not have a token, it will create a new token.
   * @param userId the user id to create a token for
   * @param token the token to create
   * @param email the email tied to the heroku account
   * @returns {Object} the token that was created or updated.
   */
  async addHerokuTokenForUser(userId, token, email) {
    const user = await this.userService.getUserByIdOrUsername(userId);

    const isTokenExisting = await this.getSequelizeHerokuTokenForUser(userId);
    if (isTokenExisting) {
      const updatedToken = await this.updateHerokuTokenForUser(userId, token);
      return updatedToken;
    }

    const tokenToBeCreated = {
      email,
      token: encryptUtil.encrypt(token.toString())
    };

    const tokenCreated = await this.herokuCredentialsRepository.create(tokenToBeCreated);
    await user.addHerokuCredentials(tokenCreated);
    return tokenCreated;
  }

  /**
   * First trades codes for a Heroku token.
   * Then adds the Heroku token for a user. If the user already has a token, it will update the
   * existing one.
   * @param userId the user id to create a token for
   * @param code the code sent by Heroku to create a token
   * @returns {Object} the token that was created or updated.
   */
  async getAndSetHerokuTokenForUser(userId, code) {
    let res;
    const clientData = config.get('oauth_apps').heroku;
    try {
      res = await fetch(`${'https://cors-anywhere.herokuapp.com/' +
        'https://id.heroku.com/oauth/token' +
        '?client_secret='}${clientData.client_secret}&grant_type=authorization_code&code=${code}`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: new fetch.Headers({
          'Content-Type': 'application/json',
          origin: 'http://localhost:8080/', // included to satisfy cors-anywhere
          Accept: 'application/json'
        }),
      });
      if (res.status >= 400) {
        return res.json();
      }
    } catch (error) {
      return error;
    }
    const refreshData = await res.text().then(text => (text ? JSON.parse(text) : null));
    if (refreshData.refresh_token) {
      const token = refreshData.refresh_token;
      try {
        res = await fetch(`${'https://cors-anywhere.herokuapp.com/' +
        'https://id.heroku.com/oauth/token' +
        '?grant_type=refresh_token&refresh_token='}${token}&client_secret=${clientData.client_secret}`, {
          method: 'POST',
          body: JSON.stringify({}),
          headers: new fetch.Headers({
            'Content-Type': 'application/json',
            origin: 'http://localhost:8080/', // included to satisfy cors-anywhere
            Accept: 'application/json'
          }),
        });
        if (res.status >= 400) {
          return res.json();
        }
      } catch (error) {
        return error;
      }
      const accessData = await res.text().then(text => (text ? JSON.parse(text) : null));


      const herokuUser = await herokuService.getHerokuAuthenticatedUser(accessData.access_token);
      const email = herokuUser.email;
      await this.addHerokuTokenForUser(userId, accessData.access_token, email);
      return accessData.access_token;
    }
  }

  /**
   * Updates the Heroku token for a user.
   * @param userId the user to update the token for
   * @param newTokenValue the heroku token to update
   * @returns {Object} the updated token
   */
  async updateHerokuTokenForUser(userId, newTokenValue) {
    const token = await this.getSequelizeHerokuTokenForUser(userId);
    if (!token) {
      throw new HerokuTokenNotFoundException(`Heroku Token for user with id ${userId} does not exist.`);
    }

    const tokenUpdated = token.update({ token: encryptUtil.encrypt(newTokenValue.toString()) });
    return tokenUpdated;
  }

  /**
   * Deletes the token for the user
   * @param userId the user to delete the token for
   */
  async deleteHerokuTokenForUser(userId) {
    const token = await this.getSequelizeHerokuTokenForUser(userId);
    await token.destroy();
  }
}
