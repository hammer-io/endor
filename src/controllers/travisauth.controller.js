import { validationResult } from 'express-validator/check';
import * as errorFormatter from '../utils/error-formatter';

let travisAuthService = {};

/**
 * Controller for GET /auth/travis
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function checkIfUserIsAuthenticatedOnTravis(req, res, next) {
  const userId = req.user.id;
  try {
    const isTravisAuthenticated =
      await travisAuthService.checkIfUserIsAuthenticatedOnTravis(userId);

    res.send({ isTravisAuthenticated });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for POST /auth/travis
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function addTravisTokenForUser(req, res, next) {
  const errors = validationResult(req).formatWith(errorFormatter.formatError);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const userId = req.user.id;
  try {
    await travisAuthService.addTravisTokenForUser(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for PUT /auth/travis
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function updateTravisTokenForUser(req, res, next) {
  const errors = validationResult(req).formatWith(errorFormatter.formatError);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const userId = req.user.id;
  const token = req.body.travisToken;
  try {
    await travisAuthService.updateTravisTokenForUser(userId, token);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for DELETE /auth/travis
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function deleteTravisTokenForUser(req, res, next) {
  const userId = req.user.id;
  try {
    await travisAuthService.deleteTravisTokenForUser(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export function setDependencies(newTravisAuthService) {
  travisAuthService = newTravisAuthService;
}
