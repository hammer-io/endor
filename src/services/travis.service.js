/* eslint-disable import/prefer-default-export,no-await-in-loop */
import fetch from 'node-fetch';

function mapTravisBuildToEndorBuild(item) {
  const formattedBuild = {};
  formattedBuild.id = item.id;
  formattedBuild.buildNumber = item.number;
  formattedBuild.state = item.state;
  formattedBuild.previousState = item.previous_state;
  formattedBuild.duration = item.duration;
  formattedBuild.type = item.event_type;
  formattedBuild.user = item.created_by.login;
  formattedBuild.started_at = item.started_at;
  formattedBuild.finished_at = item.finished_at;
  return formattedBuild;
}

/**
 * Gets the build statuses for a project
 * @param projectName the project name in the format owner/projectName
 * @param token the token
 * @returns {Promise<void>}
 */
export async function getBuildStatusesForProject(projectName, token, branchName) {
  const formattedProjectName = projectName.replace('/', '%2f');


  let done = false;
  let i = 0;
  let builds = [];
  try {
    while (!done) {
      let url = `https://api.travis-ci.org/repo/${formattedProjectName}/builds`;
      if (branchName) {
        url += `?branch.name=${branchName}`;
        url += `offset=${i * 25}`;
      } else {
        url += `?offset=${i * 25}`;
      }

      const response = await fetch(url, {
        headers: {
          'Travis-API-Version': 3,
          Authorization: `token ${token}`
        },
        method: 'GET'
      });

      const statuses = await response.json();
      builds = builds.concat(statuses.builds);
      if (statuses.builds.length === 0) {
        done = true;
      }

      i += 1;
    }
    return builds.map(mapTravisBuildToEndorBuild);
  } catch (error) {
    throw error;
  }
}
