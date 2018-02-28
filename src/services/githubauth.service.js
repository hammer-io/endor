import fetch from 'node-fetch';
import config from 'config';
import GithubTokenNotFoundException from '../error/GithubTokenNotFoundException';
import * as githubService from './github.service';
import * as encryptionUtil from '../utils/encryption';


export default class GithubAuthenticationService {
  constructor(githubCredentialsRepository, userService, logger) {
    this.githubCredentialsRepository = githubCredentialsRepository;
    this.userService = userService;
    this.log = logger;
  }

  /**
   * Checks if a user is authenticated on github. Will find the github token in
   * githubAuthentications table. If it doesn't exist, will return false. Otherwise, it will
   * check if the token in the table is valid on Github by making a request. If it's invalid, we
   * will delete the github token. If it is valid, return true.
   * @param userId the user id to check
   * @returns {Boolean} true, if the token is valid, false otherwise.
   */
  async checkIfUserIsAuthenticatedOnGithub(userId) {
    const token = await this.getGithubTokenForUser(userId);
    if (token) {
      const isUserAuthenticated =
        await githubService.isUserAuthenticated(token);

      if (isUserAuthenticated) {
        return true;
      }

      await this.deleteGithubTokenForUser(userId);
    }

    return false;
  }

  /**
   * Gets the decrypted github token for a user
   * @param userId the user id to get the token for
   * @returns {String} the token
   */
  async getGithubTokenForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getGithubCredentials();
    if (token[0]) {
      return encryptionUtil.decrypt(token[0].token);
    }

    return null;
  }


  /**
   * Gets the decrypted github token for a user
   * @param userId the user id to get the token for
   * @returns {String} the token
   */
  async getGithubTokenAndUsernameForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getGithubCredentials();
    if (token[0]) {
      return { token: encryptionUtil.decrypt(token[0].token), username: token[0].username };
    }

    return null;
  }

  /**
   * Gets the decrypted github token for a user
   * @param userId the user id to get the token for
   * @returns {String} the token
   */
  async getGithubUsernameForUser(userId) {
    this.log.info(`Getting github username for user with id: ${userId}`);
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getGithubCredentials();
    if (token[0]) {
      return token[0].username;
    }

    return null;
  }


  /**
   * Gets a github token for a user from the githubAuthentications token.
   * @param userId the user id to check
   * @returns {Object} the user's sequelize github token
   */
  async getSequelizeGithubTokenForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getGithubCredentials();
    if (token) {
      return token[0];
    }

    return null;
  }

  /**
   * Adds a github token for the given user into the githubTokens table. If a token already
   * exists for the user, it will automatically update the old one.
   * @param userId the user id to add the token for
   * @param token the token to add to the table
   * @param username the github username of the user
   * @returns {Object} the token that was created
   */
  async addGithubTokenForUser(userId, token, username) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const isTokenExisting = await this.getSequelizeGithubTokenForUser(userId);
    // update token if it already exists
    if (isTokenExisting) {
      const updatedToken = await this.updateTokenForUser(userId, token);
      return updatedToken;
    }

    const githubTokenToBeCreated = {
      token: encryptionUtil.encrypt(token.toString()),
      username
    };

    const tokenCreated = await this.githubCredentialsRepository.create(githubTokenToBeCreated);
    await user.addGithubCredentials(tokenCreated);
    return tokenCreated;
  }

  /**
   * First exchanges code and state for a github token.
   * Then adds a github token for the given user into the githubTokens table. If a token already
   * exists for the user, it will automatically update the old one.
   * @param userId the user id to add the token for
   * @param code the code to exchange for token
   * @param state the state to verify identity
   * @param username the github username of the user
   * @returns {Object} the token that was created
   */
  async getAndSetGithubTokenForUser(userId, code, state, username) {
    try {
      const clientData = config.get('oauth_apps').github;
      const res = await fetch('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token', {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientData.client_id,
          client_secret: clientData.client_secret,
          code,
          state
        }),
        headers: new fetch.Headers({
          'Content-Type': 'application/json',
          origin: 'http://localhost:8080/', // included to satisfy cors-anywhere
          Accept: 'application/json'
        }),
      });
      if (res.status < 400) {
        const data = await res.text().then(text => (text ? JSON.parse(text) : null));
        await this.addGithubTokenForUser(userId, data.access_token, username);
        return data.access_token;
      }
      return res.json();
    } catch (error) {
      return error;
    }
  }

  /**
   * Updates a token for the user.
   * @param userId The user to update the token for
   * @param newTokenValue the value fo the new token
   * @returns {Object} the token that was updated.
   */
  async updateTokenForUser(userId, newTokenValue) {
    const token = await this.getSequelizeGithubTokenForUser(userId);
    if (!token) {
      throw new GithubTokenNotFoundException(`GitHub Token for user with id ${userId} does not exist.`);
    }

    const tokenUpdated = token.update({ token: encryptionUtil.encrypt(newTokenValue.toString()) });
    return tokenUpdated;
  }

  /**
   * Destroys the github token for a user... use with catuion, there is not coming back from this.
   * @param userId the userid for which we should remove the token for
   */
  async deleteGithubTokenForUser(userId) {
    const token = await this.getSequelizeGithubTokenForUser(userId);
    await token.destroy();
  }
}
