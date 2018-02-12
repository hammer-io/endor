/* eslint-disable import/prefer-default-export */
import fetch from 'node-fetch';

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
