import express from 'express';

import * as contributorsController from './../controllers/contributors.controller';
import * as authController from '../controllers/auth.controller';
import * as projectAuth from '../authorization/projects.authorization';

export const router = express.Router();

// the project service
let projectService = {};

/**
 * @api {get} /projects/:projectId/contributors Get contributors for a project
 * @apiVersion 1.0.0
 * @apiName get contributors
 * @apiGroup Contributors
 *
 * @apiPermission none
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiParam {String} id the id of the project to get contributors for
 *
 * @apiSuccess {Object[]} contributors of the project
 * @apiSuccessExample {json} Success-Response
 * [
     {
         "id": 1,
         "username": "BobSagat",
         "email": "Bob@AFV.com",
         "firstName": "Bob",
         "lastName": "Sagat",
         "createdAt": "2017-11-12T20:26:47.000Z",
         "updatedAt": "2017-11-12T20:26:47.000Z",
         "projectContributor": {
             "createdAt": "2017-11-12T20:26:47.000Z",
             "updatedAt": "2017-11-12T20:26:47.000Z",
             "projectId": 1,
             "userId": 1
         }
     }
    ]
 */
router.get('/projects/:projectId/contributors', authController.isAuthenticated, contributorsController.getContributorsByProjectId);

/**
 * @api {get} /projects/:projectId/contributors/:user Check if a user is a contributor
 * @apiVersion 1.0.0
 * @apiName check if project is contributor
 * @apiGroup Contributors
 *
 * @apiPermission none
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiParam {String} id the id of the project
 * @apiParam {String} user user id or username
 *
 * @apiSuccessExample {json} Success-Response
 * Status: 204 No Content
 *
 * @apiErrorExample {json} Error-Response
 * Status: 404 Not Found
 */
router.get('/projects/:projectId/contributors/:user', authController.isAuthenticated, contributorsController.checkIfUserIsContributor);

/**
 * @api {post} /projects/:projectId/contributors/:user Add contributor to project
 * @apiVersion 1.0.0
 * @apiName add contributor to project
 * @apiGroup Contributors
 *
 * @apiPermission project owner
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiParam {String} projectId The id of the project.
 * @apiParam {String} user User id or username of the user to add as a contributor.
 *
 * @apiSuccess {Object[]} contributors the contributors of the project which the user was added to
 * @apiSuccessExample {json} Success-Response
 * [
    {
     "id": 1,
     "username": "BobSagat",
     "email": "Bob@AFV.com",
     "firstName": "Bob",
     "lastName": "Sagat",
     "createdAt": "2017-11-12T20:26:47.000Z",
     "updatedAt": "2017-11-12T20:26:47.000Z",
     "projectContributor": {
         "createdAt": "2017-11-12T20:26:47.000Z",
         "updatedAt": "2017-11-12T20:26:47.000Z",
         "projectId": 1,
         "userId": 1
     }
    }
  ]
 */
router.post(
  '/projects/:projectId/contributors/:user',
  authController.isAuthenticated,
  projectAuth.ownerLevelAuthorization,
  contributorsController.addContributorToProject
);

/**
 * @api {delete} /projects/:projectId/contributors/:user Remove contributor from project
 * @apiVersion 1.0.0
 * @apiName remove contributor from project
 * @apiGroup Contributors
 *
 * @apiPermission project owner
 *
 * @apiHeader Authorization Basic Auth-Token
 * @apiParam {String} projectId The id of the project.
 * @apiParam {String} user User id or username of the user to remove as a contributor.
 *
 * @apiSuccess {Object[]} contributors the contributors of the project which the user was added to
 * @apiSuccessExample {json} Success-Response
 * [
 {
  "id": 1,
  "username": "BobSagat",
  "email": "Bob@AFV.com",
  "firstName": "Bob",
  "lastName": "Sagat",
  "createdAt": "2017-11-12T20:26:47.000Z",
  "updatedAt": "2017-11-12T20:26:47.000Z",
  "projectContributor": {
      "createdAt": "2017-11-12T20:26:47.000Z",
      "updatedAt": "2017-11-12T20:26:47.000Z",
      "projectId": 1,
      "userId": 1
  }
 }
 ]
 */
router.delete(
  '/projects/:projectId/contributors/:user',
  authController.isAuthenticated,
  projectAuth.ownerLevelAuthorization,
  contributorsController.deleteContributorFromProject
);

/**
 * Set dependencies for the contributors routes
 * @param newProjectService the project service dependency
 */
export function setDependencies(newProjectService) {
  projectService = newProjectService;
  contributorsController.setProjectService(projectService);
  projectAuth.setDependencies(projectService);
}

