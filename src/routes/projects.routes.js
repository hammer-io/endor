
/**
 * The project routes. Maps any endpoint dealing with projects to their respective middleware
 * and controllers.
 */

import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as projectController from '../controllers/projects.controller';
import * as projectValidator from '../middlewares/projects.middleware';
import * as projectAuthorization from './../authorization/projects.authorization';


export const router = express.Router();

// the project service
let projectService = {};

/**
 * @api {get} /projects Get all public projects
 * @apiVersion 1.0.0
 * @apiName projects
 * @apiGroup Projects
 *
 * @apiPermission none
 *
 * @apiHeader Authorization Basic Client-Basic Auth-Token
 *
 * @apiSuccess {Object[]} projects List of all of the public projects
 * @apiSuccessExample {json} Success-Response:
 * [
 *  {
 *    "id": 1,
 *    "projectName": "TMNT",
 *    "description": "You gotta know what a crumpet is to understand cricket!",
 *    "version": "1.2.3",
 *    "license": "MIT",
 *    "authors": "Casey Jones, Raphael",
 *    "createdAt": "2017-11-12T17:08:30.000Z",
 *    "updatedAt": "2017-11-12T17:08:30.000Z",
 *    "containerizationToolId": null,
 *    "continuousIntegrationToolId": 1,
 *    "deploymentToolId": 3,
 *    "webFrameworkId": null
 *  }
 * ]
 */
router.get('/projects', authController.isAuthenticated, projectController.getAllProjects);

/**
 * @api {get} /user/projects Get projects for an authenticated user
 * @apiVersion 1.0.0
 * @apiName user projects
 * @apiGroup Projects
 *
 * @apiPermission authenticated user
 *
 * @apiHeader Authorization Basic Client-Basic Auth-Token
 *
 * @apiSuccess {Object[]} projects list of projects for authenticated user
 * @apiSuccessExample {json} Success-Response:
 {
     "owned": [
         {
             "id": 1,
             "projectName": "TMNT",
             "description": "You gotta know what a crumpet is to understand cricket!",
             "version": "1.2.3",
             "license": "MIT",
             "authors": "Casey Jones, Raphael",
             "createdAt": "2017-11-12T17:08:30.000Z",
             "updatedAt": "2017-11-12T17:08:30.000Z",
             "containerizationToolId": null,
             "continuousIntegrationToolId": 1,
             "deploymentToolId": 3,
             "webFrameworkId": null,
             "projectOwner": {
                 "createdAt": "2017-11-12T17:08:30.000Z",
                 "updatedAt": "2017-11-12T17:08:30.000Z",
                 "projectId": 1,
                 "userId": 3
             }
         }
     ],
     "contributed": [
         {
             "id": 1,
             "projectName": "TMNT",
             "description": "You gotta know what a crumpet is to understand cricket!",
             "version": "1.2.3",
             "license": "MIT",
             "authors": "Casey Jones, Raphael",
             "createdAt": "2017-11-12T17:08:30.000Z",
             "updatedAt": "2017-11-12T17:08:30.000Z",
             "containerizationToolId": null,
             "continuousIntegrationToolId": 1,
             "deploymentToolId": 3,
             "webFrameworkId": null,
             "projectContributor": {
                 "createdAt": "2017-11-12T17:08:30.000Z",
                 "updatedAt": "2017-11-12T17:08:30.000Z",
                 "projectId": 1,
                 "userId": 3
             }
         }
     ]
 }
 */
router.get('/user/projects', authController.isAuthenticated, projectController.getProjectByAuthenticatedUser);

/**
 * @api {get} /users/:user/projects Get a project by user id
 * @apiVersion 1.0.0
 * @apiName get projects for user
 * @apiGroup Projects
 *
 * @apiHeader Authorization Basic Client-Basic Auth-Token
 * @apiParam {String} user the user id or the username to find by
 *
 * @apiSuccess {[Object]} projects the list of projects for a given user
 * @apiSuccessExample {json} Success-Response:
 {
     "owned": [
         {
             "id": 1,
             "projectName": "TMNT",
             "description": "You gotta know what a crumpet is to understand cricket!",
             "version": "1.2.3",
             "license": "MIT",
             "authors": "Casey Jones, Raphael",
             "createdAt": "2017-11-12T17:08:30.000Z",
             "updatedAt": "2017-11-12T17:08:30.000Z",
             "containerizationToolId": null,
             "continuousIntegrationToolId": 1,
             "deploymentToolId": 3,
             "webFrameworkId": null,
             "projectOwner": {
                 "createdAt": "2017-11-12T17:08:30.000Z",
                 "updatedAt": "2017-11-12T17:08:30.000Z",
                 "projectId": 1,
                 "userId": 3
             }
         }
     ],
     "contributed": [
         {
             "id": 1,
             "projectName": "TMNT",
             "description": "You gotta know what a crumpet is to understand cricket!",
             "version": "1.2.3",
             "license": "MIT",
             "authors": "Casey Jones, Raphael",
             "createdAt": "2017-11-12T17:08:30.000Z",
             "updatedAt": "2017-11-12T17:08:30.000Z",
             "containerizationToolId": null,
             "continuousIntegrationToolId": 1,
             "deploymentToolId": 3,
             "webFrameworkId": null,
             "projectContributor": {
                 "createdAt": "2017-11-12T17:08:30.000Z",
                 "updatedAt": "2017-11-12T17:08:30.000Z",
                 "projectId": 1,
                 "userId": 3
             }
         }
     ]
 }
 */
router.get('/users/:user/projects', authController.isAuthenticated, projectController.getProjectsByUser);

/**
 * @api {get} /projects/:projectId Get project by id
 * @apiVersion 1.0.0
 * @apiName get project by id
 * @apiGroup Projects
 *
 * @apiPermission autenticated user
 *
 * @apiHeader Authorization Basic Client-Basic Auth-Token
 * @apiParam {String} projectId the projectId to find by
 *
 * @apiSuccess {Object} project the project
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "id": 1,
 *    "projectName": "TMNT",
 *    "description": "You gotta know what a crumpet is to understand cricket!",
 *    "version": "1.2.3",
 *    "license": "MIT",
 *    "authors": "Casey Jones, Raphael",
 *    "createdAt": "2017-11-12T17:08:30.000Z",
 *    "updatedAt": "2017-11-12T17:08:30.000Z",
 *    "containerizationToolId": null,
 *    "continuousIntegrationToolId": 1,
 *    "deploymentToolId": 3,
 *    "webFrameworkId": null,
 *    "markdownDescription": "<markdown text>"
 *  }
 */
router.get(
  '/projects/:projectId',
  authController.isAuthenticated,
  projectController.getProjectById
);

/**
 * @api {post} /user/projects Create a project for an authenticated user
 * @apiVersion 1.0.0
 * @apiName post project for authenticated user
 * @apiGroup Projects
 *
 * @apiPermission authenticated user
 *
 * @apiHeader Authorization Basic Client-Basic Auth-Token
 * @apiParam {String} projectName the name of the project
 * @apiParam {String} description the description to the project
 * @apiParam {String} version the version of the project
 * @apiParam {String} license the name of the license
 * @apiParam {[String]} authors a string of comma separated values
 * @apiParam {String} containerizationTool the name of the containerization tool
 * @apiParam {String} continuousIntegrationTool the name of the continuous integration tool
 * @apiParam {String} deploymentTool the name of the deployment tool
 * @apiParam {String} webFramework the name of the web framework
 *
 * @apiParamExample {json} Request Example:
 * {
 *     "projectName": "hammer-io",
 *     "description": "Hit it with a hammer!",
 *     "isPrivateProject": false,
 *     "version": "0.0.0",
 *     "author": "Jack",
 *     "license": "MIT",
 *     "sourceControl": "0271d7cf-8a2a-4ebb-9bc0-bd1278a4c3b8",
 *     "ci": "9c9cace2-995b-462b-848b-48c47c5f31d3",
 *     "containerization": "d0db39f6-452e-4461-abf5-146e5d8e4415",
 *     "deployment": "1d56c031-2a60-4d61-a7a7-a260e7f98610",
 *     "web": "7f6f84c3-3123-40ef-935b-479a133e7d63",
 *     "test": "4a6c48ce-a3ef-4f7c-bb13-bef287dc6daa",
 *     "database": "94b1b4c8-3c8a-4de8-9d44-160d0a6dc84e"
 * }
 *
 *
 * @apiSuccess {Object} project the created project
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "id": "38039974-763d-4956-9a1c-fedb9e8ca4ca",
 *     "projectName": "tyrdemotest445",
 *     "description": "a demo!",
 *     "version": "0.0.0",
 *     "license": "MIT",
 *     "sourceControlId": "0271d7cf-8a2a-4ebb-9bc0-bd1278a4c3b8",
 *     "continuousIntegrationToolId": "9c9cace2-995b-462b-848b-48c47c5f31d3",
 *     "containerizationToolId": "d0db39f6-452e-4461-abf5-146e5d8e4415",
 *     "deploymentToolId": "1d56c031-2a60-4d61-a7a7-a260e7f98610",
 *     "webFrameworkId": "7f6f84c3-3123-40ef-935b-479a133e7d63",
 *     "testToolId": "4a6c48ce-a3ef-4f7c-bb13-bef287dc6daa",
 *     "updatedAt": "2018-03-05T06:11:49.865Z",
 *     "createdAt": "2018-03-05T06:11:49.865Z"
 * }
 */
router.post(
  '/user/projects',
  authController.isAuthenticated,
  projectValidator.checkCreateProject(),
  projectController.createProjectForAuthenticatedUser
);

/**
 * @api {post} /users/:user/projects Create a project
 * @apiVersion 1.0.0
 * @apiName post project for user
 * @apiGroup Projects
 *
 * @apiPermission authenticated user
 *
 * @apiHeader Authorization Basic Client-Basic Auth-Token
 * @apiParam {String} user the username or userid of the user to create a project for
 * @apiParam {String} projectName the name of the project
 * @apiParam {String} description the description to the project
 * @apiParam {String} version the version of the project
 * @apiParam {String} license the name of the license
 * @apiParam {[String]} authors a string of comma separated values
 * @apiParam {String} containerization the name of the containerization tool
 * @apiParam {String} ci the name of the continuous integration tool
 * @apiParam {String} deployment the name of the deployment tool
 * @apiParam {String} web the name of the web framework
 * @apiParam {String} sourceControl the name of the sourceControl
 * @apiParam {String} test the name of the test framework
 *
 * @apiParamExample {json} Request Example:
 * {
 *     "projectName": "hammer-io",
 *     "description": "Hit it with a hammer!",
 *     "isPrivateProject": false,
 *     "version": "0.0.0",
 *     "author": "Jack",
 *     "license": "MIT",
 *     "sourceControl": "0271d7cf-8a2a-4ebb-9bc0-bd1278a4c3b8",
 *     "ci": "9c9cace2-995b-462b-848b-48c47c5f31d3",
 *     "containerization": "d0db39f6-452e-4461-abf5-146e5d8e4415",
 *     "deployment": "1d56c031-2a60-4d61-a7a7-a260e7f98610",
 *     "web": "7f6f84c3-3123-40ef-935b-479a133e7d63",
 *     "test": "4a6c48ce-a3ef-4f7c-bb13-bef287dc6daa",
 *     "database": "94b1b4c8-3c8a-4de8-9d44-160d0a6dc84e"
 * }
 * @apiParamExample {json} Request Example:
 * {
 *     "projectName": "hammer-io",
 *     "description": "Hit it with a hammer!",
 *     "isPrivateProject": false,
 *     "version": "0.0.0",
 *     "author": "Jack",
 *     "license": "MIT",
 *     "sourceControl": "0271d7cf-8a2a-4ebb-9bc0-bd1278a4c3b8"
 * }
 *
 *
 * @apiSuccess {Object} project the created project
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "id": "38039974-763d-4956-9a1c-fedb9e8ca4ca",
 *     "projectName": "tyrdemotest445",
 *     "description": "a demo!",
 *     "version": "0.0.0",
 *     "license": "MIT",
 *     "sourceControlId": "0271d7cf-8a2a-4ebb-9bc0-bd1278a4c3b8",
 *     "continuousIntegrationToolId": "9c9cace2-995b-462b-848b-48c47c5f31d3",
 *     "containerizationToolId": "d0db39f6-452e-4461-abf5-146e5d8e4415",
 *     "deploymentToolId": "1d56c031-2a60-4d61-a7a7-a260e7f98610",
 *     "webFrameworkId": "7f6f84c3-3123-40ef-935b-479a133e7d63",
 *     "testToolId": "4a6c48ce-a3ef-4f7c-bb13-bef287dc6daa",
 *     "updatedAt": "2018-03-05T06:11:49.865Z",
 *     "createdAt": "2018-03-05T06:11:49.865Z"
 * }
 */
router.post(
  '/users/:user/projects',
  authController.isAuthenticated,
  projectValidator.checkCreateProject(),
  projectController.createProjectForUser
);

/**
 * @api {patch} /projects/:projectId Update a project
 * @apiVersion 1.0.0
 * @apiName patch project
 * @apiGroup Projects
 *
 * @apiPermission Project owner
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiParam {String} id the id of the project to update
 *
 * @apiSuccess {Object} project the updated project
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "id": "38039974-763d-4956-9a1c-fedb9e8ca4ca",
 *     "projectName": "hammerio",
 *     "description": "a demo!",
 *     "version": "0.0.0",
 *     "license": "MIT",
 *     "githubRepositoryName": "/jackreach/hammerio",
 *     "travisRepositoryName": "/jackreach/hammerio",
 *     "herokuApplicationName": "hammerio",
 *     "sourceControlId": "0271d7cf-8a2a-4ebb-9bc0-bd1278a4c3b8",
 *     "continuousIntegrationToolId": "9c9cace2-995b-462b-848b-48c47c5f31d3",
 *     "containerizationToolId": "d0db39f6-452e-4461-abf5-146e5d8e4415",
 *     "deploymentToolId": "1d56c031-2a60-4d61-a7a7-a260e7f98610",
 *     "webFrameworkId": "7f6f84c3-3123-40ef-935b-479a133e7d63",
 *     "testToolId": "4a6c48ce-a3ef-4f7c-bb13-bef287dc6daa",
 *     "updatedAt": "2018-03-05T06:11:49.865Z",
 *     "createdAt": "2018-03-05T06:11:49.865Z"
 * }
 */
router.patch(
  '/projects/:projectId',
  authController.isAuthenticated,
  projectAuthorization.ownerLevelAuthorization,
  projectValidator.checkUpdateProject(),
  projectController.updateProjectById
);

/**
 * @api {delete} /projects/:projectId Delete a project
 * @apiVersion 1.0.0
 * @apiName delete project
 * @apiGroup Projects
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiPermission Project owner
 *
 * @apiSuccess {Object} project the deleted project
 * @apiSuccessExample {json} Success-Response
 * Status: 204 No Content
 */
router.delete(
  '/projects/:projectId',
  authController.isAuthenticated,
  projectAuthorization.ownerLevelAuthorization,
  projectController.deleteProjectById
);

/**
 * @api {get} /projects/:projectId/issues Get issues for project
 * @apiVersion 1.0.0
 * @apiName get issues for project
 * @apiGroup Projects
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiPermission Authenticated User
 *
 * @apiParam {String} projectId the projectId
 * @apiParam {String} state filter by the state of issue, can be 'open', 'close', or 'all'
 * @apiParam {String} limit set a limit of how many issues can be returned
 *
 * @apiSuccess {Object[]} response an array of issues, below are the fields
 * @apiSuccess {String} url the url to the issue
 * @apiSuccess {String} number the issue number
 * @apiSuccess {String} user the user who opened the issue
 * @apiSuccess {String} state the state of the issue, either opened or closed
 * @apiSuccess {String} title the title of the issue
 * @apiSuccess {String} description the description of the issue
 * @apiSuccess {String} created_at_date the date the issue was created
 * @apiSuccess {String} closed_at_date the date the issue was closed, null if it hasn't been closed
 *
 * @apiSuccessExample {json} Success-Response:
 * [
 {
     "url": "https://api.github.com/repos/owner/repo/issues/issueNumber",
     "number": 1,
     "user": "username",
     "state": "open",
     "title": "the title goes here",
     "description": "the description goes here",
     "created_at_date": "2018-02-09T16:10:58Z",
     "closed_at_date": null
  }
 ]
 */
router.get(
  '/projects/:projectId/issues',
  authController.isAuthenticated,
  projectController.getIssuesForProject
);

/**
 * @api {get} /projects/:projectId/pullrequests Get pull requests for project
 * @apiVersion 1.0.0
 * @apiName get pull requests for project
 * @apiGroup Projects
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiPermission Authenticated User
 *
 * @apiParam {String} projectId the projectId
 * @apiParam {String} state filter by the state of pull requests, can be 'open', 'close', or 'all'
 * @apiParam {String} limit set a limit of how many pull requests can be returned
 *
 * @apiSuccess {Object[]} response an array of pull requests, below are the fields
 * @apiSuccess {String} url the url to the pull requests
 * @apiSuccess {String} number the pull requests number
 * @apiSuccess {String} user the user who opened the pull requests
 * @apiSuccess {String} state the state of the pull requests, either opened or closed
 * @apiSuccess {String} title the title of the pull requests
 * @apiSuccess {String} description the description of the pull requests
 * @apiSuccess {String} created_at_date the date the pull requests was created
 * @apiSuccess {String} closed_at_date the date the pull requests was closed, null if it hasn't been
 * closed
 *
 * @apiSuccessExample {json} Success-Response:
 * [
 {
     "url": "https://api.github.com/repos/owner/repo/pulls/number",
     "number": 1,
     "user": "username",
     "state": "open",
     "title": "the title goes here",
     "description": "the description goes here",
     "created_at_date": "2018-02-09T16:10:58Z",
     "closed_at_date": null
  }
 ]
 */
router.get(
  '/projects/:projectId/pullrequests',
  authController.isAuthenticated,
  projectController.getPullRequestsForProject
);

/**
 * @api {get} /projects/:projectId/pullrequests Get pull requests for project
 * @apiVersion 1.0.0
 * @apiName get pull requests for project
 * @apiGroup Projects
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiPermission Authenticated User
 *
 * @apiParam {String} projectId the projectId
 * @apiParam {String} limit set a limit of how many pull requests can be returned
 *
 * @apiSuccess {Object[]} response an array of commits, below are the fields
 * @apiSuccess {String} message the commit message
 * @apiSuccess {String} user the username who made the commit
 * @apiSuccess {String} date the date of the commit
 * @apiSuccess {String} url the url to the commit
 *
 * @apiSuccessExample {json} Success-Response:
 * [
   {
     "message": "the commit message",
     "user": "username",
     "date": "2018-02-09T03:45:28Z",
     "url": "url to the commit"
    }
 ]
 */
router.get(
  '/projects/:projectId/commits',
  authController.isAuthenticated,
  projectController.getCommitsForProject
);

/**
 * @api {get} /projects/:projectId/buildstatuses Get build statuses for project
 * @apiVersion 1.0.0
 * @apiName get build statuses for project
 * @apiGroup Projects
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiPermission Authenticated User
 *
 * @apiParam {String} projectId the projectId
 * @apiParam {String} limit set a limit of how many pull requests can be returned
 *
 * @apiSuccess {Object[]} response an array of builds, below are the fields
 * @apiSuccess {String} id the build id
 * @apiSuccess {String} buildNumber the build number of the build
 * @apiSuccess {String} state the state of the build
 * @apiSuccess {String} duration the duration of the build
 * @apiSuccess {String} type the type of build, push or pull request
 * @apiSuccess {String} user the user who made the commit
 * @apiSuccess {String} started_at when the build was started
 * @apiSuccess {String} finished_at when the build finished
 * @apiSuccess {String} url the url to the commit
 *
 * @apiSuccessExample {json} Success-Response:
 *  [
  {
     "id": 123456,
     "buildNumber": "1",
     "state": "passed",
     "previousState": "passed",
     "duration": 228,
     "type": "pull_request",
     "user": "the user",
     "started_at": "2018-02-10T21:35:58Z",
     "finished_at": "2018-02-10T21:38:13Z"
    }
  ]
 */
router.get(
  '/projects/:projectId/buildstatuses',
  authController.isAuthenticated,
  projectController.getBuildStatusesForProject
);

/**
 * @api {get} /projects/:projectId/logs/:buildNumber
 * @apiVersion 1.0.0
 * @apiName get logs for build
 * @apiGroup projects
 *
 * @apiPermission Authenticated User
 *
 * @apiParam {String} projectId the projectId
 * @apiParam {String} buildNumber the the build number on TravisCI
 *
 * @apiSuccess {String} jobId the job id the logs are for
 * @apiSuccess {String} log the contents of the log
 *
 * * @apiSuccessExample {json} Success-Response:
 *
 {
   "jobId": "1234",
   "log": "log content here"
 }
 */
router.get(
  '/projects/:projectId/logs/:buildNumber',
  authController.isAuthenticated,
  projectController.getLogsForBuilldForProject
);

/**
 * @api {get} /projects/:projectId/heroku Get heroku app info for project
 * @apiVersion 1.0.0
 * @apiName get heroku app info for project
 * @apiGroup Projects
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiPermission Authenticated User
 *
 * @apiParam {String} projectId the projectId
 *
 * @apiSuccess {String} url the heroku app url to the deployed application
 * @apiSuccess {String} updated_at the last time the app was updated on heroku
 *
 * @apiSuccessExample {json} Success-Response:
 *
  {
    "url": "https://jack-bkuiket.herokuapp.com/",
    "updated_at": "2018-01-26T18:57:51Z"
  }
 */
router.get(
  '/projects/:projectId/heroku',
  authController.isAuthenticated,
  projectController.getHerokuAppInfoForProject
);

/**
 * @api {get} /projects/:projectId/zipFile
 * @apiVersion 1.0.0
 * @apiName get zip files for project
 * @apiGroup Projects
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiPermission Authenticated User
 *
 * @apiParam {String} projectId
 *
 * @apiSuccess {Zip} the zipped project files
 */
router.get(
  '/projects/:projectId/zipFile',
  authController.isAuthenticated,
  projectController.getZipFileForAuthenticatedUser
);

/**
 * Sets the project service dependency for the controller
 * @param newProjectService the project service dependency
 * @param newToolService the tool service dependency
 * @param newGithubAuthService the github auth service dependency
 * @param newHerokuAuthService the heroku auth service dependency
 * @param newTravisAuthService the travis auth service dependency
 */
export function setProjectService(
  newProjectService,
  newToolService,
  newGithubAuthService,
  newHerokuAuthService,
  newTravisAuthService
) {
  projectService = newProjectService;
  projectController.setProjectService(
    projectService,
    newToolService,
    newGithubAuthService,
    newHerokuAuthService,
    newTravisAuthService
  );
  projectAuthorization.setDependencies(projectService);
}
