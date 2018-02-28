import { validationResult } from 'express-validator/check';
import * as errorFormatter from '../utils/error-formatter';

let githubAuthenticationService = {};

/**
 * Controller for GET /auth/github
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function checkIfUserIsAuthenticatedForGithub(req, res, next) {
  const userId = req.user.id;

  try {
    const isGithubAuthenticated =
      await githubAuthenticationService.checkIfUserIsAuthenticatedOnGithub(userId);
    return res.send({ isGithubAuthenticated });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for POST /auth/github
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function createNewGithubToken(req, res, next) {
  const errors = validationResult(req).formatWith(errorFormatter.formatError);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const userId = req.user.id;
  const token = req.body.githubToken;
  const username = req.body.githubUsername;

  try {
    await githubAuthenticationService.addGithubTokenForUser(userId, token, username);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for POST /auth/github2
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function exchangeForNewGithubToken(req, res, next) {
  const errors = validationResult(req).formatWith(errorFormatter.formatError);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const userId = req.user.id;
  const code = req.body.code;
  const state = req.body.state;
  const username = req.body.githubUsername;

  try {
    await githubAuthenticationService.getAndSetGithubTokenForUser(userId, code, state, username);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for PUT /auth/github
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function updateTokenForUser(req, res, next) {
  const errors = validationResult(req).formatWith(errorFormatter.formatError);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const userId = req.user.id;
  const token = req.body.githubToken;

  try {
    await githubAuthenticationService.updateTokenForUser(userId, token);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for DELETE /auth/github
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
export async function deleteGithubTokenForUser(req, res, next) {
  const userId = req.user.id;
  try {
    await githubAuthenticationService.deleteGithubTokenForUser(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export function setDependencies(newGithubAuthenticationService) {
  githubAuthenticationService = newGithubAuthenticationService;
}
