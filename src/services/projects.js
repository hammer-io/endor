import sequalize from './../db/sequelize';
import { getActiveLogger } from '../utils/winston';

const log = getActiveLogger();

/**
 * Gets all of the projects in the system
 * @returns all of the projects in the system
 */
export async function getAllProejcts() {
  const projects = await sequalize.Project.findAll();
  return projects;
}

/**
 * Gets project by id
 * @param id the id to find by
 * @returns the project with the given id
 */
export async function getProjectById(id) {
  const project = await sequalize.Project.findById(id);
  return project;
}

/**
 * Finds projects for a user
 * @param userId the userId to find by
 * @returns the projects for the user separated by owned and contributed
 */
export async function getProjectsByUserId(userId) {
  const user = await sequalize.User.findById(userId);

  // if the user was not found, return null
  if (user === null) {
    log.error(`user id of ${userId} was not found`);
    return null;
  }

  const projectsOwned = await user.getProjectsOwned();
  const projectsContributed = await user.getProjectsContributed();

  const projects = {};
  projects.owned = projectsOwned;
  projects.contributed = projectsContributed;

  return projects;
}

/**
 * Soft deletes a project by id
 * @param id project id
 * @param isForceDelete determines if it should be soft deleted or hard deleted
 * @returns the project that was deleted
 */
export async function deleteProjectById(id, isForceDelete) {
  const project = await sequalize.Project.findById(id);
  if (project === null) {
    return null;
  }

  await project.destroy({ force: isForceDelete });
  return project;
}

