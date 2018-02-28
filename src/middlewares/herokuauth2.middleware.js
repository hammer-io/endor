/* eslint-disable import/prefer-default-export */
import { check } from 'express-validator/check';

/**
 * A valid request to the travis Authentication POST, PUT routes must have a travisToken as a
 * field of the request body.
 * @returns {*[]}
 */
export function checkIsValidRequest() {
  return [
    check('code').exists().withMessage('Heroku code must exist.')
  ];
}
