import * as encryptUtil from '../utils/encryption';
import * as herokuService from '../services/heroku.service';
import HerokuTokenNotFoundException from '../error/HerokuTokenNotFoundException';

export default class HerokuAuthService {
  constructor(herokuTokenRepository, userService, logger) {
    this.herokuTokenRepository = herokuTokenRepository;
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
    const token = await user.getHerokuToken();
    if (token) {
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
    const token = await user.getHerokuToken();
    if (token) {
      // TODO: apiKey should later be changed to token when tyr is changed to look for token
      return { apiKey: encryptUtil.decrypt(token[0].token), email: token[0].email };
    }

    return null;
  }

  /**
   * Gets the email tied to the user
   * @param userId the user id to get the token for
   * @returns {String} the token or null
   */
  async getHerokuEmailForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getHerokuToken();
    if (token) {
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
    const token = await user.getHerokuToken();
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

    const tokenCreated = await this.herokuTokenRepository.create(tokenToBeCreated);
    await user.addHerokuToken(tokenCreated);
    return tokenCreated;
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
