import { check } from 'express-validator/check';

/**
 * Middleware for the create project endpoints
 * @returns {Array} create project middlewares
 */
export function checkCreateProject() {
  return [
    check('projectConfigurations.projectName').exists().withMessage('Project name is required.'),
    check('projectConfigurations.description').exists().withMessage('Project description is required.'),
    check('projectConfigurations.version').exists().withMessage('Project version is required.').matches(/^(\d+\.)?(\d+\.)?(\*|\d+)/),
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
