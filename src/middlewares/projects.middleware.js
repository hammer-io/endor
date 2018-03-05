import { check } from 'express-validator/check';

// Regex matches uuid or an empty string since the parameter is optional
const optionalIdRegex = /^$|^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;

/**
 * Middleware for the create project endpoints
 * @returns {Array} create project middlewares
 */
export function checkCreateProject() {
  return [
    check('projectName').exists().withMessage('Project name is required.'),
    check('description').exists().withMessage('Project description is required.'),
    check('version').exists().withMessage('Project version is required.').matches(/^(\d+\.)?(\d+\.)?(\*|\d+)/),
    check('author').exists().withMessage('Project author is required.'),
    check('sourceControl')
      .matches(optionalIdRegex)
      .withMessage('The source control field must be a well-formatted id.'),
    check('ci')
      .matches(optionalIdRegex)
      .withMessage('The continuous integration field must be a well-formatted id.'),
    check('containerization')
      .matches(optionalIdRegex)
      .withMessage('The containerization field must be a well-formatted id.'),
    check('deployment')
      .matches(optionalIdRegex)
      .withMessage('The deployment field must be a well-formatted id'),
    check('web')
      .matches(optionalIdRegex)
      .withMessage('The web field must be a well-formatted id'),
    check('test')
      .matches(optionalIdRegex)
      .withMessage('The test field must be a well-formatted id'),
    check('database')
      .matches(optionalIdRegex)
      .withMessage('The database field must be a well-formatted id')
  ];
}

/**
 * Middleware for the update project endpoint
 * @returns {Array} update project middlewares
 */
export function checkUpdateProject() {
  return [
    check('version').exists().withMessage('Project version is required.').matches(/^(\d+\.)?(\d+\.)?(\*|\d+)/)
  ];
}
