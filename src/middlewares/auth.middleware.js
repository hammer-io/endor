import { check } from 'express-validator/check';

export function checkAuthorize() {
  return [
    check('transaction_id').exists().withMessage('A transaction_id is required')
  ];
}

export function checkToken() {
  return [
    check('grant_type').exists().withMessage('Grant_type is required')
  ];
}
