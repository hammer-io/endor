import GithubTokenNotFoundException from '../error/GithubTokenNotFoundException';
import * as githubService from './github.service';
import * as encryptionUtil from '../utils/encryption';


export default class GithubAuthenticationService {
  constructor(githubTokenRepository, userService, logger) {
    this.githubTokenRepository = githubTokenRepository;
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
    const token = await user.getGithubToken();
    if (token) {
      return encryptionUtil.decrypt(token[0].token);
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
    const token = await user.getGithubToken();
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

    const tokenCreated = await this.githubTokenRepository.create(githubTokenToBeCreated);
    await user.addGithubToken(tokenCreated);
    return tokenCreated;
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
