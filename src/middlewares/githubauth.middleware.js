/* eslint-disable import/prefer-default-export */
import { check } from 'express-validator/check';

/**
 * A valid request to the Github Authentication POST, PUT routes must have a githubToken as a
 * field of the request body.
 * @returns {*[]}
 */
export function checkIsValidRequest() {
  return [
    check('githubToken').exists().withMessage('Github Token must exist.')
  ];
}
