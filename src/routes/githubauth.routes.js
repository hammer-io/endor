/* eslint-disable import/prefer-default-export */
import express from 'express';

import * as authController from '../controllers/auth.controller';
import * as githubAuthController from '../controllers/githubauth.controller';
import * as githubAuthValidator from '../middlewares/githubauth.middleware';

export const router = express.Router();

/**
 * @api { get } /auth/github Check Github Authentication
 * @apiVersion 1.0.0
 * @apiName Check Github Authentication
 * @apiGroup Github
 *
 * @apiPermission Authenticated User
 *
 * @apiDescription Checks if the user is authenticated with github. It will remove the token if
 * it is not a valid github token.
 *
 * @apiSuccess {boolean} isAuthenticated true if authenticated, false otherwise
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "isGithubAuthenticated": true
 * }
 */
router.get('/auth/github', authController.isAuthenticated, githubAuthController.checkIfUserIsAuthenticatedForGithub);

/**
 * @api {POST} /auth/github Add Github Authentication Token
 * @apiVersion 1.0.0
 * @apiName Add Github Authentication Token
 * @apiGroup Github
 *
 * @apiPermission Authenticated User
 * @apiDescription Adds a github authentication token for the user to the database. If a token
 * already exists for the user, this function will overwrite the existing token.
 *
 * @apiParam {String} githubToken the user's github token
 * @apiParamExample {json} Request-Example:
 * {
 *  "githubToken": "123abc456"
 * }
 */
router.post(
  '/auth/github',
  authController.isAuthenticated,
  githubAuthValidator.checkIsValidRequest(),
  githubAuthController.createNewGithubToken
);

/**
 * @api {PUT} /auth/github Update Github Authentication Token
 * @apiVersion 1.0.0
 * @apiName Update Github Authentication Token
 * @apiGroup Github
 *
 * @apiPermission Authenticated User
 * @apiDescription Updates a github authentication token for the user. Will return a 404 if a
 * token did not exist previously.
 *
 * @apiParam {String} githubToken the user's github token
 * @apiParamExample {json} Request-Example:
 * {
 *  "githubToken": "123abc456"
 * }
 */
router.put(
  '/auth/github',
  authController.isAuthenticated,
  githubAuthValidator.checkIsValidRequest,
  githubAuthController.updateTokenForUser
);

/**
 * @api {DELETE} /auth/github Delete Github Authentication Token
 * @apiVersion 1.0.0
 * @apiName Delete Github Authentication Token
 * @apiGroup Github
 *
 * @apiPermission Authenticated User
 * @apiDescription Deletes a github authentication token for the user.
 */
router.delete('/auth/github', authController.isAuthenticated, githubAuthController.deleteGithubTokenForUser);

export function setDependencies(newGithubAuthenticationService) {
  githubAuthController.setDependencies(newGithubAuthenticationService);
}
