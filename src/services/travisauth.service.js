import fetch from 'node-fetch';

import * as encryptUtil from '../utils/encryption';
import TravisTokenNotFoundException from '../error/TravisTokenNotFoundException';
import TravisApiError from '../error/TravisApiError';
import GithubTokenNotFoundException from '../error/GithubTokenNotFoundException';

export default class TravisAuthenticationService {
  constructor(travisTokenRepository, userService, githubAuthService, logger) {
    this.travisTokenRepository = travisTokenRepository;
    this.userService = userService;
    this.githubAuthService = githubAuthService;
    this.log = logger;
  }

  /**
   * Checks if the user is authenticated on Travis. If the user is not authenticated, then it
   * will return false. Otherwise, return true. If the user is not authenticated, it will delete
   * the token if it currently exists.
   * @param userId
   * @returns {Boolean} returns true if the user is authenticated, false otherwise.
   */
  async checkIfUserIsAuthenticatedOnTravis(userId) {
    const token = await this.getTravisTokenForUser(userId);
    if (token) {
      return true;
    }

    return false;
  }

  /**
   * Gets the decrypted travis token for the user
   * @param userId the user id to get the token for
   * @returns {String} the token or null
   */
  async getTravisTokenForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getTravisToken();
    if (token[0]) {
      return encryptUtil.decrypt(token[0].token);
    }

    return null;
  }

  /**
   * Gets the Travis token a user. If the token exists, it will return the token, otherwise it
   * will reutrn null.
   * @param userId the user id to get the token for
   * @returns {Object} the token or null
   */
  async getSequelizeTravisTokenForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getTravisToken();
    if (token) {
      return token[0];
    }

    return null;
  }


  /**
   * Exchanges a github token for a travis access token. This uses Travis API V2, which will be
   * deprecated eventually.
   *
   * @param githubToken the github token to exchange
   * @returns {Promise<string | *>} the travis access token
   */
  static async exchangeGithubTokenForTravisToken(githubToken) {
    const url = 'https://api.travis-ci.org/auth/github';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'User-Agent': 'Travis/1.0',
          Accept: 'application/vnd.travis-ci.2+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          github_token: githubToken
        })
      });
      const responseBody = await response.json();
      return responseBody.access_token;
    } catch (error) {
      throw new TravisApiError(error.message);
    }
  }


  /**
   * Adds the Travis token for a user. If the user already has a token, it will update the
   * existing one. If the user does not have a token, it will create a new token.
   * @param userId the user id to create a token for
   * @param token the token to create
   * @returns {Object} the token that was created or updated.
   */
  async addTravisTokenForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const githubToken = await this.githubAuthService.getGithubTokenForUser(userId);
    if (!githubToken) {
      throw new GithubTokenNotFoundException(`Github Token for user ${userId} not found`);
    }

    const travisToken = await this.exchangeGithubTokenForTravisToken(githubToken);
    const isTokenExisting = await this.getSequelizeTravisTokenForUser(userId);
    if (isTokenExisting) {
      const updatedToken = await this.updateTravisTokenForUser(userId, travisToken);
      return updatedToken;
    }

    const tokenToBeCreated = {
      token: encryptUtil.encrypt(travisToken.toString())
    };

    const tokenCreated = await this.travisTokenRepository.create(tokenToBeCreated);
    await user.addTravisToken(tokenCreated);

    return tokenCreated;
  }

  /**
   * Updates the Travis token for a user.
   * @param userId the user to update the token for
   * @param newTokenValue the travis token to update
   * @returns {Object} the updated token
   */
  async updateTravisTokenForUser(userId, newTokenValue) {
    const token = await this.getSequelizeTravisTokenForUser(userId);
    if (!token) {
      throw new TravisTokenNotFoundException(`Travis Token for user with id ${userId} does not exist.`);
    }

    const tokenUpdated = token.update({ token: encryptUtil.encrypt(newTokenValue.toString()) });
    return tokenUpdated;
  }

  /**
   * Deletes the token for the user
   * @param userId the user to delete the token for
   */
  async deleteTravisTokenForUser(userId) {
    const token = await this.getSequelizeTravisTokenForUser(userId);
    await token.destroy();
  }
}
