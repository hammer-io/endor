/* eslint-disable import/prefer-default-export */
import express from 'express';

import * as authController from '../controllers/auth.controller';
import * as travisAuthController from '../controllers/travisauth.controller';
import * as travisAuthValidator from '../middlewares/travisauth.middleware';

export const router = express.Router();

/**
 * @api { get } /auth/heroku Check Heroku Authentication
 * @apiVersion 1.0.0
 * @apiName Check Heroku Authentication
 * @apiGroup Heroku
 *
 * @apiPermission Authenticated User
 *
 * @apiDescription Checks if the user is authenticated with heroku. It will remove the token if
 * it is not a valid heroku token.
 *
 * @apiSuccess {boolean} isAuthenticated true if authenticated, false otherwise
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "isHerokuAuthenticated": true
 * }
 */
router.get('/auth/heroku', authController.isAuthenticated, travisAuthController.checkIfUserIsAuthenticatedOnTravis);

/**
 * @api {POST} /auth/heroku Add Heroku Authentication Token
 * @apiVersion 1.0.0
 * @apiName Add Heroku Authentication Token
 * @apiGroup Heroku
 *
 * @apiPermission Authenticated User
 * @apiDescription Adds a heroku authentication token for the user to the database. If a token
 * already exists for the user, this function will overwrite the existing token.
 *
 * @apiParam {String} heroku the user's heroku token
 * @apiParamExample {json} Request-Example:
 * {
 *  "herokuToken": "123abc456"
 * }
 */
router.post(
  '/auth/heroku',
  authController.isAuthenticated,
  travisAuthValidator.checkIsValidRequest(),
  travisAuthController.addTravisTokenForUser
);

/**
 * @api {PUT} /auth/heroku Update heroku Authentication Token
 * @apiVersion 1.0.0
 * @apiName Update Heroku Authentication Token
 * @apiGroup Heroku
 *
 * @apiPermission Authenticated User
 * @apiDescription Updates a heroku authentication token for the user. Will return a 404 if a
 * token did not exist previously.
 *
 * @apiParam {String} heroku the user's heroku token
 * @apiParamExample {json} Request-Example:
 * {
 *  "herokuToken": "123abc456"
 * }
 */
router.put(
  '/auth/heroku',
  authController.isAuthenticated,
  travisAuthValidator.checkIsValidRequest,
  travisAuthController.updateTravisTokenForUser
);

/**
 * @api {DELETE} /auth/heroku Delete Heroku Authentication Token
 * @apiVersion 1.0.0
 * @apiName Delete Heroku Authentication Token
 * @apiGroup Heroku
 *
 * @apiPermission Authenticated User
 * @apiDescription Deletes a heroku authentication token for the user.
 */
router.delete(
  '/auth/heroku',
  authController.isAuthenticated,
  travisAuthController.deleteTravisTokenForUser
);

export function setDependencies(newHerokuAuthService) {
  travisAuthController.setDependencies(newHerokuAuthService);
}
