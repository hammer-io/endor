/* eslint-disable import/prefer-default-export */
import { check } from 'express-validator/check';

/**
 * A valid request to the Github Authentication POST, PUT routes must have a githubToken as a
 * field of the request body.
 * @returns {*[]}
 */
export function checkIsValidRequest() {
  return [
    check('code').exists().withMessage('Github code must exist.'),
    check('state').exists().withMessage('Github state must exist.')
  ];
}
