/* eslint-disable prefer-destructuring */
import express from 'express';
import { check, validationResult } from 'express-validator/check';
import * as projectService from '../services/projects.service';
import * as responseHelper from '../utils/response-helper';

const router = express.Router();

/**
 * @api {get} /projects Get all public projects
 * @apiVersion 1.0.0
 * @apiName projects
 * @apiGroup Projects
 *
 * @apiPermission none
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
router.get('/projects', async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();
    res.send(projects);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} /user/projects Get projects for an authenticated user
 * @apiVersion 1.0.0
 * @apiName user projects
 * @apiGroup Projects
 *
 * @apiPermission authenticated user
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
router.get('/user/projects', async (req, res, next) => {
  const userId = 1; // TODO get userId from authenticated request

  try {
    const projects = await projectService.getProjectsByUser(userId);
    console.log(projects);
    res.send(projects);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} /users/:userId/projects Get a project by user id
 * @apiVersion 1.0.0
 * @apiName get projects for user
 * @apiGroup Projects
 *
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
router.get('/users/:user/projects', async (req, res, next) => {
  const user = req.params.user;

  try {
    const projects = await projectService.getProjectsByUser(user);
    res.send(projects);
  } catch (error) {
    next(error);
  }
});

/**
 * @api {get} /projects/:projectId Get project by id
 * @apiVersion 1.0.0
 * @apiName get project by id
 * @apiGroup Projects
 *
 * @apiPermission autenticated user
 *
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
 *    "webFrameworkId": null
 *  }
 */
router.get('/projects/:projectId', async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const project = await projectService.getProjectById(projectId);
    res.send(project);
  } catch (error) {
    next(error)
  }
});

/**
 * @api {post} user/projects Create a project for an authenticated user
 * @apiVersion 1.0.0
 * @apiName post project for authenticated user
 * @apiGroup Projects
 *
 * @apiPermission authenticated user
 *
 * @apiParam {String} projectName the name of the project
 * @apiParam {String} description the description to the project
 * @apiParam {String} version the version of the project
 * @apiParam {String} license the name of the license
 * @apiParam {[String]} authors a string of comma separated values
 * @apiParam {String} containerizationTool the name of the containerization tool or <None>
 * @apiParam {String} continuousIntegrationTool the name of the continuous integration tool or
 * <None>
 * @apiParam {String} deploymentTool the name of the deployment tool or <None>
 * @apiParam {String} webFramework the name of the web framework or <None>
 *
 * @apiParamExample {json} Request Example:
 * {
 *  "projectName": "hammer-io",
 *  "description": "Hit it with a Hammer!",
 *  "version": "0.0.1",
 *  "license": "MIT",
 *  "authors": "Holmgang, Jack",
 *  "containerizationTool": "2",
 *  "continuousIntegrationTool": "1",
 *  "deploymentTool": "3",
 *  "webFramework": "4"
 * }
 *
 *
 * @apiSuccess {Object} project the created project
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "id": 1,
 *    "projectName": "hammer-io",
 *    "description": "Hit it with a Hammer!",
 *    "version": "0.0.1",
 *    "license": "MIT",
 *    "authors": "Holmgang, Jack",
 *    "createdAt": "2017-11-12T17:08:30.000Z",
 *    "updatedAt": "2017-11-12T17:08:30.000Z",
 *    "containerizationToolId": 2,
 *    "continuousIntegrationToolId": 1,
 *    "deploymentToolId": 3,
 *    "webFrameworkId": 4
 *  }
 */
router.post(
  '/user/projects', [
    check('projectName').exists().withMessage('Project name is required.'),
    check('description').exists().withMessage('Project description is required.'),
    check('version').exists().withMessage('Project version is required.').matches(/^(\d+\.)?(\d+\.)?(\*|\d+)/),
  ],
  async (req, res, next) => {
    const userId = 1; // TODO authenticate user
    try {
      const projectCreated = await projectService.createProject(req.body, userId);
      res.send(projectCreated);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @api {post} /user/:user/projects Create a project
 * @apiVersion 1.0.0
 * @apiName post project for user
 * @apiGroup Projects
 *
 * @apiPermission authenticated user
 *
 * @apiParam {String} user the username or userid of the user to create a project for
 * @apiParam {String} projectName the name of the project
 * @apiParam {String} description the description to the project
 * @apiParam {String} version the version of the project
 * @apiParam {String} license the name of the license
 * @apiParam {[String]} authors a string of comma separated values
 * @apiParam {String} containerizationTool the name of the containerization tool or <None>
 * @apiParam {String} continuousIntegrationTool the name of the continuous integration tool or
 * <None>
 * @apiParam {String} deploymentTool the name of the deployment tool or <None>
 * @apiParam {String} webFramework the name of the web framework or <None>
 *
 * @apiParamExample {json} Request Example:
 * {
 *  "projectName": "hammer-io",
 *  "description": "Hit it with a Hammer!",
 *  "version": "0.0.1",
 *  "license": "MIT",
 *  "authors": "Holmgang, Jack",
 *  "containerizationTool": "2",
 *  "continuousIntegrationTool": "1",
 *  "deploymentTool": "3",
 *  "webFramework": "4"
 * }
 *
 *
 * @apiSuccess {Object} project the created project
 * @apiSuccessExample {json} Success-Response:
 *  {
 *    "id": 1,
 *    "projectName": "hammer-io",
 *    "description": "Hit it with a Hammer!",
 *    "version": "0.0.1",
 *    "license": "MIT",
 *    "authors": "Holmgang",
 *    "createdAt": "2017-11-12T17:08:30.000Z",
 *    "updatedAt": "2017-11-12T17:08:30.000Z",
 *    "containerizationToolId": 2,
 *    "continuousIntegrationToolId": 1,
 *    "deploymentToolId": 3,
 *    "webFrameworkId": 4
 *  }
 */
router.post(
  '/users/:user/projects', [
    check('projectName').exists().withMessage('Project name is required.'),
    check('description').exists().withMessage('Project description is required.'),
    check('version').exists().withMessage('Project version is required.').matches(/^(\d+\.)?(\d+\.)?(\*|\d+)/),
  ],

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const project = req.body;
    const user = req.params.user;
    try {
      const projectCreated = await projectService.createProject(project, user);
      res.send(projectCreated);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @api {patch} /projects/:id Update a project
 * @apiVersion 1.0.0
 * @apiName patch project
 * @apiGroup Projects
 *
 * @apiPermission project owner
 *
 * @apiParam {String} id the id of the project to update
 *
 * @apiSuccess {Object} project the updated project
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
 *    "webFrameworkId": null
 *  }
 */
router.patch(
  '/projects/:id', [
    check('version').exists().withMessage('Project version is required.').matches(/^(\d+\.)?(\d+\.)?(\*|\d+)/)
  ],
  async (req, res, next) => {
    const projectToUpdate = req.body;
    const projectId = req.params.id;

    try {
      const projectUpdated = await projectService.updateProject(projectToUpdate, projectId);
      res.send(projectUpdated);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @api {delete} /projects/:id Delete a project
 * @apiVersion 1.0.0
 * @apiName delete project
 * @apiGroup Projects
 *
 * @apiPermission project owner
 *
 * @apiSuccess {Object} project the deleted project
 * @apiSuccessExample {json} Success-Response
 * Status: 204 No Content
 */
router.delete('/projects/:id', async (req, res, next) => {
  const projectId = req.params.id;
  try {
    await projectService.deleteProjectById(projectId, false);
    responseHelper.noContent(res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
