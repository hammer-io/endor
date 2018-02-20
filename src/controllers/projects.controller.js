/* eslint-disable prefer-destructuring,no-unused-vars */

/**
 * The project controller. This controller is for any routes dealing with projects. It is
 * dependent on the projectService which should be set in the project-routes.js file.
 */
import * as tyr from 'tyr-cli/dist/tyr';
const del = require('del');
import zip from 'adm-zip';

import { validationResult } from 'express-validator/check';
import * as responseHelper from './../utils/response-helper';

let projectService = {};
const zipper = zip();

/**
 * Handles the GET /project endpoint
 * @param req the request
 * @param res the response
 * @param next to the next middleware
 */
export async function getAllProjects(req, res, next) {
  try {
    const projects = await projectService.getAllProjects();
    res.send(projects);
  } catch (error) {
    next(error);
  }
}

/**
 * Helper function to get a project for a user
 * @param user the user to create the project for
 * @param res the response
 * @param next the next middleware
 */
async function getProjectsForUser(user, res, next) {
  try {
    const projects = await projectService.getProjectsByUser(user);
    res.send(projects);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the GET /user/projects endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function getProjectByAuthenticatedUser(req, res, next) {
  const userId = req.user.id;
  await getProjectsForUser(userId, res, next);
}

/**
 * Handles the GET user/:user/projects endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function getProjectsByUser(req, res, next) {
  const user = req.params.user;
  await getProjectsForUser(user, res, next);
}

/**
 * Handles the GET projects/:projectId endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function getProjectById(req, res, next) {
  const projectId = req.params.projectId;

  try {
    const project = await projectService.getProjectById(projectId);
    res.send(project);
  } catch (error) {
    next(error);
  }
}

/**
 * Helper function to create a new new project
 * @param user the user to create a project for
 * @param project the project to create
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
async function createProject(user, project, req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const configs = project;

  configs.credentials =
  {
    github: { username: 'clarkerican', token: '8cc99cd5a3c293c5baf5c50e9dccdab724e10b83' },
    heroku:
    {
      email: 'clarkerican@gmail.com',
      apiKey: '252775ce-5886-41f0-980c-2371a9309d77'
    },
    sequelize: { username: 'root', password: 'root' }
  };



  try {
    // Only do this if there is success upon creating the project
    await projectService.createProject(configs.projectConfigurations, user);

    zipper.addLocalFolder(`${process.cwd()}/${project.projectName}`, `${project.projectName}`, undefined);
    res.set('Content-Type', 'application/zip');
    res.send(await zipper.toBuffer());
    await tyr.generateProject(configs);
  } catch (error) {
    // do nothing, we already sent the res
  }
}

/**
 * Handles the POST user/projects endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function createProjectForAuthenticatedUser(req, res, next) {
  const user = req.user.id;
  await createProject(user, req.body, req, res, next);
}

/**
 * Handles the POST user/:user/proejcts endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function createProjectForUser(req, res, next) {
  const user = req.user.id;
  await createProject(user, req.body, res, next);
}

/**
 * Handles the PATCH projects/:projectId endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function updateProjectById(req, res, next) {
  const projectToUpdate = req.body;
  const projectId = req.params.projectId;

  try {
    const projectUpdated = await projectService.updateProject(projectToUpdate, projectId);
    res.send(projectUpdated);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the DELETE projects/:projectId endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function deleteProjectById(req, res, next) {
  const projectId = req.params.projectId;
  try {
    await projectService.deleteProjectById(projectId, false);
    responseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the GET /projects/:projectId/issues route
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function getIssuesForProject(req, res, next) {
  const projectId = req.params.projectId;
  const state = req.query.state;
  const limit = req.query.limit;
  const user = req.user.id;

  try {
    const issues = await projectService.getIssuesForProject(projectId, state, user);
    if (limit) {
      res.status(200).send(issues.slice(0, limit));
    } else {
      res.status(200).send(issues);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the GET /projects/:projectId/pullrequests route
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function getPullRequestsForProject(req, res, next) {
  const projectId = req.params.projectId;
  const state = req.query.state;
  const limit = req.query.limit;
  const user = req.user.id;

  try {
    const pullRequests = await projectService.getPullRequestsForProject(projectId, state, user);
    if (limit) {
      res.status(200).send(pullRequests.slice(0, limit));
    } else {
      res.status(200).send(pullRequests);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the GET /projects/:projectId/commits route
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function getCommitsForProject(req, res, next) {
  const projectId = req.params.projectId;
  const user = req.user.id;
  const limit = req.query.limit;

  try {
    const commits = await projectService.getCommitsForProject(projectId, user);
    if (limit) {
      res.status(200).send(commits.slice(0, limit));
    } else {
      res.status(200).send(commits);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the GET /projects/:projectId/buildstatuses endpoint
 * @param req the request
 * @param res the response
 * @param next the next middlware
 */
export async function getBuildStatusesForProject(req, res, next) {
  const projectId = req.params.projectId;
  const user = req.user.id;
  const limit = req.query.limit;
  let branchName = req.query.branch;
  if (!branchName) {
    branchName = null;
  }

  try {
    const statuses = await projectService.getBuildStatusesForProject(projectId, user, branchName);
    if (limit) {
      res.status(200).send(statuses.slice(0, limit));
    } else {
      res.status(200).send(statuses);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the GET /projects/:projectId/logs/:buildNumber endpoint
 * @param req the request
 * @param res the response
 * @param next the next middlware
 */
export async function getLogsForBuilldForProject(req, res, next) {
  const user = req.user.id;
  const buildNumber = req.params.buildNumber;

  try {
    const logs = await projectService.getLogsForBuildForProject(buildNumber, user);
    res.status(200).send(logs);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the GET /projects/:projectId/heroku endpoint
 * @param req the request
 * @param res the response
 * @param next the next middlware
 */
export async function getHerokuAppInfoForProject(req, res, next) {
  const projectId = req.params.projectId;
  const user = req.user.id;

  try {
    const appInfo = await projectService.getHerokuAppInfoForProject(projectId, user);
    res.status(200).send(appInfo);
  } catch (error) {
    next(error);
  }
}
/**
 * Injects the project service dependency
 * @param newProjectService the project service
 */
export function setProjectService(newProjectService) {
  projectService = newProjectService;
}
