/* eslint-disable import/prefer-default-export */
import fetch from 'node-fetch';
import HerokuApiError from '../error/HerokuApiError';

const herokuApiUrl = 'https://api.heroku.com';
const Accept = 'application/vnd.heroku+json; version=3';

export async function checkIfUserIsAuthenticated(token) {
  try {
    const result = await fetch(`${herokuApiUrl}/account`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept
      }
    });

    return result.status === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Get app info from Heroku API
 * @param appName the app name to get
 * @param token the token
 * @returns {Promise<*>} the app info
 */
export async function getAppByProjectName(appName, token) {
  try {
    const result = await fetch(`${herokuApiUrl}/apps/${appName}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept
      }
    });

    const app = await result.json();
    const formattedAppInfo = {};
    formattedAppInfo.url = app.web_url;
    formattedAppInfo.updated_at = app.updated_at;
    return formattedAppInfo;
  } catch (error) {
    throw new HerokuApiError(error.message);
  }
}
