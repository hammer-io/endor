/* eslint-disable no-unused-vars,no-restricted-syntax,no-await-in-loop,no-param-reassign */
import zip from 'adm-zip';
import * as tyr from 'tyr-cli/dist/tyr';
import { validationResult } from 'express-validator/check';
import fs from 'fs-extra';

import * as responseHelper from './../utils/response-helper';
import ZipFileNotFoundException from '../error/ZipFileNotFoundException';
import TravisTokenNotFoundException from '../error/TravisTokenNotFoundException';

const del = require('del');

/**
 * The project controller. This controller is for any routes dealing with projects. It is
 * dependent on the projectService which should be set in the project-routes.js file.
 */

let projectService = {};
let toolService = {};
let herokuAuthService = {};
let githubAuthService = {};
let travisAuthService = {};
const projectLocation = `${process.cwd()}/generated-projects`;
let tooling = {};

/**
 * Retrieves and sets the github credentials for the given user in the configs
 * @param configs new project configuration
 * @param user the user id
 * @returns {Promise<void>}
 */
async function setGithubCredentials(configs, user) {
  configs.credentials.github = await githubAuthService.getGithubTokenAndUsernameForUser(user);
}

/**
 * Retrieves and sets the travis credentials for the given user in the configs
 * @param configs new project configuration
 * @param user the user id
 * @returns {Promise<void>}
 */
async function setTravisCredentials(configs, user) {
  const travisToken = await travisAuthService.getTravisTokenForUser(user);
  if (!travisToken) {
    throw new TravisTokenNotFoundException(`A travis token is not found for this ${user}`);
  }
}

/**
 * Retrieves and sets the heroku credentials for the given user in the configs
 * @param configs new project configuration
 * @param user the user id
 * @returns {Promise<void>}
 */
async function setHerokuCredentials(configs, user) {
  configs.credentials.heroku = await herokuAuthService.getHerokuTokenAndEmailForUser(user);
  configs.projectConfigurations.herokuAppName = configs.projectConfigurations.projectName;
}

async function setSequelizeCredentials(configs, user) {
  configs.credentials.sequelize = { username: 'root', password: 'root' };
}

/**
 * Creates the github url extension for the user
 * @param configs new project configurations
 * @returns {Promise<string>}
 */
async function setGithubRepositoryName(configs) {
  const projectName = configs.projectConfigurations.projectName;
  const githubUsername = configs.credentials.github.username;
  return `/${githubUsername}/${projectName}`;
}

/**
 * Creates the travis url extension for the user
 * @param configs new project configurations
 * @returns {Promise<string>}
 */
async function setTravisRepositoryName(configs) {
  const projectName = configs.projectConfigurations.projectName;
  const githubUsername = configs.credentials.github.username;
  return `/${githubUsername}/${projectName}`;
}

/**
 * Creates the heroku app name for the user
 * @param configs new project configurations
 * @returns {Promise<string>}
 */
async function setHerokuUrl(configs) {
  return configs.projectConfigurations.herokuAppName;
}

/**
 * The credentials object maps the tool name to the corresponding method to setup the
 * necessary credentials.
 */
const credentials = {
  github: setGithubCredentials,
  travisci: setTravisCredentials,
  heroku: setHerokuCredentials,
  sequelize: setSequelizeCredentials
};

/**
 * Maps the tool name to the url/repository name as is required by the database and a setupUrl
 * function to structure the url according to how the tool structures its urls.
 */
const url = {
  github: {
    name: 'githubRepositoryName',
    setupUrl: setGithubRepositoryName
  },
  travisci: {
    name: 'travisRepositoryName',
    setupUrl: setTravisRepositoryName
  },
  heroku: {
    name: 'herokuApplicationName',
    setupUrl: setHerokuUrl
  }
};

/**
 * Updates the configs to be in a format necessary for the project to be added to the
 * database. Adds credentials for specified tools if necessary.
 * @param config the project's configs
 * @param user the user creating the project
 * @returns {Promise<*>}
 */
async function updateConfigs(config, user) {
  const configs = config;
  configs.toolingConfigurations = {};
  configs.credentials = {};
  for (const key of Object.keys(configs.projectConfigurations)) {
    const toolId = configs.projectConfigurations[key];
    if (tooling[key.toLowerCase()]) {
      const toolName = await tooling[key.toLowerCase()](toolId);
      configs.toolingConfigurations[key] = toolName;
      if (credentials[toolName.toLowerCase()]) {
        await credentials[toolName.toLowerCase()](configs, user);
      }
    }
  }
  return configs;
}

/**
 * Updates the project in the database with the github url, travis url and heroku name.
 * @param configs the new project's configs
 * @param projectId the id of the new project
 */
async function updateProjectTools(configs, projectId) {
  const appNames = {};
  for (const key of Object.keys(configs.toolingConfigurations)) {
    const toolName = configs.toolingConfigurations[key].toLowerCase();
    const urlName = url[toolName].name;
    if (urlName) {
      appNames[urlName] = await url[toolName].setupUrl(configs);
    }
  }

  projectService.updateProject(appNames, projectId);
}

/**
 * Handles the GET /projects/:projectId/zipFiles
 * @param req the request
 * @param res the response
 * @param next the next middleware
 * @returns {Promise<void>}
 */
export async function getZipFileForAuthenticatedUser(req, res, next) {
  try {
    const user = req.user.id;
    const projectId = req.params.projectId;

    const zipper = zip();
    const project = await projectService.getProjectById(projectId);
    const filePath = `${projectLocation}/${user}/${project.id}`;

    if (fs.existsSync(filePath)) {
      zipper.addLocalFolder(`${filePath}`, `${project.projectName}`, undefined);
      res.set('Content-Type', 'application/zip');
      res.send(await zipper.toBuffer());
    } else {
      next(new ZipFileNotFoundException('Zipped files for the given project id not found!'));
    }
  } catch (error) {
    next(error);
  }
}

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
    const project = await projectService.getProjectInformationById(projectId);
    res.send(project);
  } catch (error) {
    next(error);
  }
}

/**
 * Helper function to create a new new project. Creates the files for the project, then
 * adds the project to the database, returns the newly created project data, and setups
 * up all necessary third-party tools.
 * @param user the user creating the project
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

  let configs = {
    projectConfigurations: project
  };
  let projectId;
  let projectPath;

  try {
    configs = await updateConfigs(configs, user);
    const newProject = await projectService.createProject(configs.projectConfigurations, user);
    projectId = newProject.id;
    if (!fs.existsSync(`${projectLocation}`)) {
      fs.mkdirSync(`${projectLocation}`);
    }
    const filePath = `${projectLocation}/${user}`;
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }
    projectPath = `${filePath}/${projectId}`;
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }
    await tyr.generateBasicNodeProject(configs, projectPath);
    await tyr.generateStaticFiles(configs, projectPath);
    res.set('Content-Type', 'application/json');
    res.send(newProject);
  } catch (error) {
    try {
      if (projectId) {
        // If there was an error, and the project was created, delete it
        await projectService.deleteProjectById(projectId, false);
      }
    } catch (deleteProjectError) {
      // do nothing, the project was probably not created
    }
    return next(error);
  }
  try {
    await tyr.setUpThirdPartyTools(configs);
    await tyr.commitToGithub(configs, projectPath);
    await updateProjectTools(configs, projectId);
  } catch (error) {
    // do nothing, we already sent the res, and it cannot be sent again
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
 * @param newToolService the tool service
 * @param newGithubAuthService the githubAuth service
 * @param newHerokuAuthService the heroku Auth service
 * @param newTravisAuthService the travisAuth service
 */
export function setProjectService(
  newProjectService,
  newToolService,
  newGithubAuthService,
  newHerokuAuthService,
  newTravisAuthService
) {
  projectService = newProjectService;
  toolService = newToolService;
  githubAuthService = newGithubAuthService;
  herokuAuthService = newHerokuAuthService;
  travisAuthService = newTravisAuthService;

  tooling = {
    sourcecontrol: toolService.sourceControlToolName,
    ci: toolService.ciToolName,
    containerization: toolService.containerizationToolName,
    deployment: toolService.deploymentToolName,
    web: toolService.webFrameworksName,
    test: toolService.testFrameworksName,
    database: toolService.databaseToolName
  };
}
