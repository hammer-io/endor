/* eslint-disable prefer-destructuring */

import * as responseHelper from '../utils/response-helper';
import OwnerNotFoundException from '../error/OwnerNotFoundException';

let projectService = {};

/**
 * Handles the /projects/:projectId/owners endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function getOwnersByProjectId(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const owners = await projectService.getOwnersByProjectId(projectId);
    res.send(owners);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the /projects/:projectId/owners/:user
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function checkIfUserIsOwner(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const user = req.params.user;
    const isUserAOwner =
      await projectService.checkIfUserIsOwnerOnProject(projectId, user);
    if (isUserAOwner) {
      responseHelper.noContent(res);
    } else {
      throw new OwnerNotFoundException(`User ${user} not found as a owner on project with id ${projectId}`);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the POST /projects/:projectId/owners/:user endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function addOwnerToProject(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const user = req.params.user;
    const owners = await projectService.addOwnerToProject(projectId, user);
    res.status(201).send(owners);
  } catch (error) {
    next(error);
  }
}

/**
 * Handles the DELETE /projects/:id/owners/:user endpoint
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function deleteOwnerFromProject(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const user = req.params.user;
    const owners = await projectService.deleteOwnerFromProject(projectId, user);
    res.status(200).send(owners);
  } catch (error) {
    next(error);
  }
}

/**
 * Sets the project service for the controller
 * @param newProjectService the new project service
 */
export function setProjectService(newProjectService) {
  projectService = newProjectService;
}
