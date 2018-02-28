import { validationResult } from 'express-validator/check';
import * as errorFormatter from '../utils/error-formatter';

let herokuAuthService = {};

/**
 * Controller for GET /auth/heroku
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function checkIfUserIsAuthenticatedOnHeroku(req, res, next) {
  const userId = req.user.id;
  try {
    const isHerokuAuthenticated =
      await herokuAuthService.checkIfUserIsAuthenticatedOnHeroku(userId);

    res.send({ isHerokuAuthenticated });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for POST /auth/heroku
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function addHerokuTokenForUser(req, res, next) {
  const errors = validationResult(req).formatWith(errorFormatter.formatError);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const userId = req.user.id;
  const token = req.body.herokuToken;
  const email = req.body.email;
  try {
    await herokuAuthService.addHerokuTokenForUser(userId, token, email);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for POST /auth/heroku/code
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function exchangeForNewHerokuToken(req, res, next) {
  const errors = validationResult(req).formatWith(errorFormatter.formatError);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const userId = req.user.id;
  const code = req.body.code;
  const email = req.body.email;
  try {
    await herokuAuthService.getAndSetHerokuTokenForUser(userId, code, email);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for PUT /auth/heroku
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function updateHerokuTokenForUser(req, res, next) {
  const errors = validationResult(req).formatWith(errorFormatter.formatError);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const userId = req.user.id;
  const token = req.body.herokuToken;
  try {
    await herokuAuthService.updateHerokuTokenForUser(userId, token);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for DELETE /auth/heroku
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function deleteHerokuTokenForUser(req, res, next) {
  const userId = req.user.id;
  try {
    await herokuAuthService.deleteHerokuTokenForUser(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export function setDependencies(newHerokuAuthService) {
  herokuAuthService = newHerokuAuthService;
}
