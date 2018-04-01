import fetch from 'node-fetch';
import config from 'config';

export default class KomaService {
  constructor(log) {
    this.log = log;
  }

  /**
   * Authenticates a project with koma
   * @param projectId the project id to authenticate
   * @returns {Promise<*>} the token (api key)
   */
  async authenticateWithKoma(projectId) {
    this.log.info('Koma Service: authenticateWithKoma()');

    const koma = config.get('koma');
    const url = koma.url;
    const secret = koma.secret;
    try {
      const response = await fetch(`${url}/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`
        },
        body: JSON.stringify({ projectId })
      });

      const body = await response.json();
      const token = body.token.token;
      return token;
    } catch (error) {
      throw error;
    }
  }
}
