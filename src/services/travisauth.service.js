
export default class TravisAuthenticationService {
  constructor(travisTokenRepository, userService, logger) {
    this.travisTokenRepository = travisTokenRepository;
    this.userService = userService;
    this.log = logger;
  }

  async checkIfUserIsAuthenticatedOnTravis(userId) {
    const token = await this.getTravisTokenForUser(userId);


  }

  /**
   * Gets the Travis token a user. If the token exists, it will return the token, otherwise it
   * will reutrn null.
   * @param userId the user id to get the token for
   * @returns {Object} the token or null
   */
  async getTravisTokenForUser(userId) {
    const user = await this.userService.getUserByIdOrUsername(userId);
    const token = await user.getTravisToken();
    if (token) {
      return token[0];
    }

    return null;
  }

  async addTravisTokenForUser(userId, token) {

  }

  async updateTravisTokenForUser(userId, token) {

  }

  async deleteTravisTokenForUser(userId) {
    const token = await this.getTravisTokenForUser(userId);
    await token.destroy();
  }
}
