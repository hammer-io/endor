/* eslint-disable no-param-reassign,no-await-in-loop */
import fetch from 'node-fetch';
import { getActiveLogger } from '../utils/winston';

const log = getActiveLogger();

const octokit = require('@octokit/rest')(); // using the form to be compatible with their
// documentation and it does not work with import.

/**
 * Gets the authenticated user
 * @param token the token to get the user for
 * @returns {Object} the authenticated user
 */
export async function getAuthenticatedUser(token) {
  octokit.authenticate({
    type: 'oauth',
    token
  });

  try {
    const user = await octokit.users.get({});
    return user.data;
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

function mapGithubIssuesFormatToEndorIssuesFormat(issue) {
  const formattedIssue = {};
  formattedIssue.url = issue.url;
  formattedIssue.number = issue.number;
  formattedIssue.user = issue.user.login;
  formattedIssue.state = issue.state;
  formattedIssue.title = issue.title;
  formattedIssue.description = issue.body;
  formattedIssue.created_at_date = issue.created_at;
  formattedIssue.closed_at_date = issue.closed_at;
  return formattedIssue;
}

/**
 * Gets the issues for a github repository
 * @param repositoryName the repository name in the format username/repoName
 * @param state the state, which should be 'open', 'closed', or 'all'. Will default to 'all'
 * @param token the token for the user
 * @returns {Object[]} the issues
 */
export async function getIssuesForRepository(repositoryName, state, token) {
  octokit.authenticate({
    type: 'oauth',
    token
  });

  const splitRepoName = repositoryName.split('/');
  const owner = splitRepoName[0];
  const repo = splitRepoName[1];

  // valid values of state are 'all', 'open', 'closed'
  if (state !== 'all' && state !== 'open' && state !== 'closed') {
    state = 'all';
  }

  let response = await octokit.issues.getForRepo({
    owner,
    repo,
    state,
    per_page: 100,
  });

  let { data } = response;
  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response);
    data = data.concat(response.data);
  }

  const formattedIssues = data.map(mapGithubIssuesFormatToEndorIssuesFormat);
  return formattedIssues;
}

/**
 * Gets the pull requests for a github repository
 * @param repositoryName the repository name in the format username/repoName
 * @param state the state, which should be 'open', 'closed', or 'all'. Will default to 'all'
 * @param token the token for the user
 * @returns {Object[]} the pull requests
 */
export async function getPullRequestsForRepository(repositoryName, state, token) {
  octokit.authenticate({
    type: 'oauth',
    token
  });

  const splitRepoName = repositoryName.split('/');
  const owner = splitRepoName[0];
  const repo = splitRepoName[1];

  // valid values of state are 'all', 'open', 'closed'
  if (state !== 'all' && state !== 'open' && state !== 'closed') {
    state = 'all';
  }

  let response = await octokit.pullRequests.getAll({
    owner,
    repo,
    state,
    per_page: 100,
  });

  let { data } = response;
  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response);
    data = data.concat(response.data);
  }

  const formattedPullRequests = data.map(mapGithubIssuesFormatToEndorIssuesFormat);
  return formattedPullRequests;
}

function mapGithubCommitsToEndorCommits(item) {
  const formattedCommit = {};
  formattedCommit.message = item.commit.message;
  formattedCommit.user = item.author.login;
  formattedCommit.date = item.commit.author.date;
  formattedCommit.url = item.commit.url;
  return formattedCommit;
}

/**
 * Gets all of the commits for the project
 * @param repositoryName the repository name in the format username/repoName
 * @param token the token for the user
 * @returns {Promise<Object[]>} the commits for the repository
 */
export async function getCommitsForRepository(repositoryName, token) {
  octokit.authenticate({
    type: 'oauth',
    token
  });

  const splitRepoName = repositoryName.split('/');
  const owner = splitRepoName[0];
  const repo = splitRepoName[1];
  let response = await octokit.repos.getCommits({
    owner,
    repo,
    per_page: 100,
  });

  let { data } = response;
  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response);
    data = data.concat(response.data);
  }

  const formattedCommits = data.map(mapGithubCommitsToEndorCommits);
  return formattedCommits;
}

/**
 * Gets the contents of the README file for a GitHub repository
 *
 * @param repositoryName Repository name in the form of user/projectName
 * @returns {Promise<String>}
 */
export async function getREADMEForProject(repositoryName) {
  log.info(`ProjectService: getting README.md file for GitHub repo: ${repositoryName}`);
  try {
    const url = `https://raw.githubusercontent.com/${repositoryName}/master/README.md`;
    const response = await fetch(url);
    if (response.status !== 200) {
      return '';
    }

    const readmeData = await response.text();
    return readmeData;
  } catch (error) {
    // just return an empty string if there was an error
    return '';
  }
}
