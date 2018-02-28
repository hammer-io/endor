/* eslint-disable import/prefer-default-export */
import express from 'express';

import * as authController from '../controllers/auth.controller';
import * as herokuAuthAuthController from '../controllers/herokuauth.controller';
import * as herokuAuthValidator from '../middlewares/herokuauth.middlware';

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
router.get(
  '/auth/heroku',
  authController.isAuthenticated,
  herokuAuthAuthController.checkIfUserIsAuthenticatedOnHeroku
);

/**
 * @api {POST} /auth/heroku Add Heroku Authentication Token
 * @apiVersion 1.0.0
 * @apiName Add Heroku Authentication Token
 * @apiGroup Heroku
 *
 * @apiPermission Authenticated User
 * @apiDescription Adds a heroku authentication token for the user to the database. If it is
 * created/updated successfully, it will return a status code of 204. If a token already exists
 * for the user, this function will overwrite the existing token.
 *
 * @apiParam {String} heroku the user's heroku token
 * @apiParamExample {json} Request-Example:
 * {
 *  "herokuToken": "123abc456",
 *  "email": "usersHerokuEmail@gmail.com"
 * }
 */
router.post(
  '/auth/heroku',
  authController.isAuthenticated,
  herokuAuthValidator.checkIsValidRequest(),
  herokuAuthAuthController.addHerokuTokenForUser
);

/**
 * @api {POST} /auth/heroku2 Exchange Heroku code for Heroku token
 * @apiVersion 1.0.0
 * @apiName Exchange for Heroku Authentication Token
 * @apiGroup Heroku
 *
 * @apiPermission Authenticated User
 * @apiDescription Exchanges a code for a Heroku auth token and stores the Heroku
 * authentication token for the user to the database. If a token
 * already exists for the user, this function will overwrite the existing token. If it is
 * created/updated successfully, it will return a status code of 204.
 *
 * @apiParam {String} code the user's heroku code
 * @apiParamExample {json} Request-Example:
 * {
 *  "code": "7e8d7f7f-d8ab-44c6-af9e-7b7971413708"
 * }
 */
router.post(
  '/auth/heroku/code',
  authController.isAuthenticated,
  herokuAuthValidator.checkIsValidExchangeRequest(),
  herokuAuthAuthController.exchangeForNewHerokuToken
);

/**
 * @api {PUT} /auth/heroku Update heroku Authentication Token
 * @apiVersion 1.0.0
 * @apiName Update Heroku Authentication Token
 * @apiGroup Heroku
 *
 * @apiPermission Authenticated User
 * @apiDescription Updates a heroku authentication token for the user. If it is updated
 * successfully, it will return a status code of 204. Will return a 404 if a
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
  herokuAuthValidator.checkIsValidRequest(),
  herokuAuthAuthController.updateHerokuTokenForUser
);

/**
 * @api {DELETE} /auth/heroku Delete Heroku Authentication Token
 * @apiVersion 1.0.0
 * @apiName Delete Heroku Authentication Token
 * @apiGroup Heroku
 *
 * @apiPermission Authenticated User
 * @apiDescription Deletes a heroku authentication token for the user. If it is deleted
 * successfully, it will return a status code of 204.
 */
router.delete(
  '/auth/heroku',
  authController.isAuthenticated,
  herokuAuthAuthController.deleteHerokuTokenForUser
);

export function setDependencies(newHerokuAuthService) {
  herokuAuthAuthController.setDependencies(newHerokuAuthService);
}
