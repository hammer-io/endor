/* eslint-disable import/prefer-default-export,no-await-in-loop */
import fetch from 'node-fetch';

function mapTravisBuildToEndorBuild(item) {
  return {
    id: item.id,
    buildNumber: item.number,
    state: item.state,
    previousState: item.previous_state,
    duration: item.duration,
    type: item.event_type,
    user: item.created_by.login,
    started_at: item.started_at,
    finished_at: item.finished_at
  };
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

  // the travis api uses paging for their build statuses API. We want to get all builds for the
  // user's project (this might change later, but would be an optimization). It's offset is 25
  // builds. So, this loops through the code and adds an offset of the number of times
  // it's been through the loop * the number of offsets (25 by default).
  try {
    while (!done) {
      let url = `https://api.travis-ci.org/repo/${formattedProjectName}/builds`;

      // if the user passed in a branch name, set the branch name here.
      // set the offset after the branch name.
      if (branchName) {
        url += `?branch.name=${branchName}`;
        url += `offset=${i * 25}`;
      } else {
        // if the user did not pass a branch name, set the offset
        url += `?offset=${i * 25}`;
      }

      const response = await fetch(url, {
        headers: {
          'Travis-API-Version': 3,
          Authorization: `token ${token}`
        },
        method: 'GET'
      });

      // get the resopnse body.
      const statuses = await response.json();

      // add the builds from this request to the master liset
      builds = builds.concat(statuses.builds);

      // if there was no builds on the page, we are done going through the pages.
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
