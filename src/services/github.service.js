const octokit = require('@octokit/rest')(); // using the form to be compatible with their
// documentation and it does not work with import.

/**
 * Gets the authenticated user
 * @param token the token to get the user for
 * @returns {Object} the authenticated user
 */
export async function getAuthenticatedUser(token) {
  console.log(token);
  octokit.authenticate({
    type: 'oauth',
    token
  });

  try {
    const user = await octokit.users.get({});
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Checks if the user is authenticated
 * @param token the token to authenticate
 * @returns {Boolean} true if authenticated, false otherwise
 */
export async function isUserAuthenticated(token) {
  const user = await getAuthenticatedUser(token);
  if (user) {
    return true;
  }

  return false;
}
