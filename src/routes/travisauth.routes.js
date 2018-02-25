/* eslint-disable import/prefer-default-export */
import express from 'express';

import * as authController from '../controllers/auth.controller';
import * as travisAuthController from '../controllers/travisauth.controller';
import * as travisAuthValidator from '../middlewares/travisauth.middleware';

export const router = express.Router();

/**
 * @api { get } /auth/travis Check Travis Authentication
 * @apiVersion 1.0.0
 * @apiName Check Travis Authentication
 * @apiGroup Travis
 *
 * @apiPermission Authenticated User
 *
 * @apiDescription Checks if the user is authenticated with travis. It will remove the token if
 * it is not a valid travis token.
 *
 * @apiSuccess {boolean} isAuthenticated true if authenticated, false otherwise
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "isTravisAuthenticated": true
 * }
 */
router.get('/auth/travis', authController.isAuthenticated, travisAuthController.checkIfUserIsAuthenticatedOnTravis);

/**
 * @api {POST} /auth/travis Add Travis Authentication Token
 * @apiVersion 1.0.0
 * @apiName Add Travis Authentication Token
 * @apiGroup Travis
 *
 * @apiPermission Authenticated User
 * @apiDescription Adds a travis authentication token for the user to the database. If a token
 * already exists for the user, this function will overwrite the existing token. If it is
 * created/updated successfully, it will return a status code of 204.
 *
 * @apiParam {String} travisToken the user's travis token
 * @apiParamExample {json} Request-Example:
 * {
 *  "travisToken": "123abc456"
 * }
 */
router.post(
  '/auth/travis',
  authController.isAuthenticated,
  travisAuthValidator.checkIsValidRequest(),
  travisAuthController.addTravisTokenForUser
);

/**
 * @api {PUT} /auth/travis Update travis Authentication Token
 * @apiVersion 1.0.0
 * @apiName Update Travis Authentication Token
 * @apiGroup Travis
 *
 * @apiPermission Authenticated User
 * @apiDescription Updates a travis authentication token for the user. Will return a 404 if a
 * token did not exist previously. If it is updated successfully, it will return a status code
 * of 204.
 *
 * @apiParam {String} travisToken the user's travis token
 * @apiParamExample {json} Request-Example:
 * {
 *  "travisToken": "123abc456"
 * }
 */
router.put(
  '/auth/travis',
  authController.isAuthenticated,
  travisAuthValidator.checkIsValidRequest(),
  travisAuthController.updateTravisTokenForUser
);

/**
 * @api {DELETE} /auth/travis Delete Travis Authentication Token
 * @apiVersion 1.0.0
 * @apiName Delete Travis Authentication Token
 * @apiGroup Travis
 *
 * @apiPermission Authenticated User
 * @apiDescription Deletes a travis authentication token for the user. If it is deleted
 * successfully, it will return a status code of 204.
 */
router.delete(
  '/auth/travis',
  authController.isAuthenticated,
  travisAuthController.deleteTravisTokenForUser
);

export function setDependencies(newTravisAuthService) {
  travisAuthController.setDependencies(newTravisAuthService);
}
