/* eslint-disable import/prefer-default-export */
import { check } from 'express-validator/check';

/**
 * A valid request to the heroku Authentication POST, PUT routes must have a herokuToken as a
 * field of the request body.
 * @returns {*[]}
 */
export function checkIsValidRequest() {
  return [
    check('herokuToken').exists().withMessage('Heroku Token must exist.')
  ];
}

/**
 * A valid request to the heroku ExchangeForToken POST
 * @returns {*[]}
 */
export function checkIsValidExchangeRequest() {
  return [
    check('code').exists().withMessage('Heroku code must exist.')
  ];
}
