import { InviteStatus } from '../db/sequelize';

import InviteNotFoundException from '../error/InviteNotFoundException';
import InvalidRequestException from '../error/InvalidRequestException';
import RequestParamError from '../error/RequestParamError';
import { isValidInviteStatus, getInvalidStatusMessage, isNonNegativeInteger } from '../middlewares/invites.middleware';

const MONTHS = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December'
];
const MILLIS_PER_DAY = (1000 * 60 * 60 * 24);

export default class InviteService {
  /**
   * Invite Service constructor
   * @param inviteRepository the invite repository to inject (most likely something from sequalize)
   * @param log the logger to inject
   */
  constructor(inviteRepository, log) {
    this.inviteRepository = inviteRepository;
    this.log = log;
  }

  /**
   * @param invite the invite object
   * @returns {string} a date string in the format "day month year" (e.g. 27 February 2018) for
   *   the expiration of the invite.
   */
  static getInviteExpirationDateString(invite) {
    const dateCreatedMillis = Date.parse(invite.createdAt);
    const expirationDateMillis =
      dateCreatedMillis + (MILLIS_PER_DAY * invite.daysFromCreationUntilExpiration);
    const expDate = new Date(expirationDateMillis);
    return `${expDate.getDate()} ${MONTHS[expDate.getMonth()]} ${expDate.getFullYear()}`;
  }

  /**
   * Validates a invite
   * @param invite the invite to validate
   * @param asNewInvite boolean indicates whether it should be validated
   *   as a new invite or as an update
   * @returns {Array} list of errors
   */
  static async validateInvite(invite, asNewInvite) {
    const errors = [];
    if (asNewInvite) {
      if (!invite.userInvitedId) {
        errors.push(new RequestParamError('userInvitedId', 'User is required.'));
      }

      if (!invite.projectInvitedToId) {
        errors.push(new RequestParamError('projectInvitedToId', 'Project is required.'));
      }

      if (!invite.projectName) {
        errors.push(new RequestParamError('projectName', 'Project name is required.'));
      }
    } else if (!invite.status) {
      errors.push(new RequestParamError('status', 'Status is required for invite updates.'));
    }

    if (invite.daysFromCreationUntilExpiration
      && !isNonNegativeInteger(invite.daysFromCreationUntilExpiration)) {
      errors.push(new RequestParamError('daysFromCreationUntilExpiration', 'Must be a non-negative integer.'));
    }

    if (invite.status && !isValidInviteStatus(invite.status)) {
      errors.push(new RequestParamError('status', getInvalidStatusMessage()));
    }

    return errors;
  }

  static attachStatusToFilter(status, filter) {
    if (status) {
      if (isValidInviteStatus(status)) {
        // eslint-disable-next-line no-param-reassign
        filter.status = status;
      } else {
        throw new InvalidRequestException([new RequestParamError('status', getInvalidStatusMessage())]);
      }
    }
  }

  /**
   * Gets a invite by the invite id
   * @param inviteId the invite id to find by
   * @returns {Object} the invite that was found
   */
  async getInviteById(inviteId) {
    this.log.info(`InviteService: find invite with id of ${inviteId}`);
    const inviteFound = await this.inviteRepository.findOne({
      where: {
        id: inviteId
      }
    });

    if (inviteFound === null) {
      throw new InviteNotFoundException(`Invite with id ${inviteId} could not be found.`);
    }

    return inviteFound;
  }

  /**
   * Gets all invites for the given project
   * @param projectId the project id to find by
   * @param statusToFilterBy the status to filter invites by
   * @returns {Object} the invite that was found
   */
  async getInvitesByProjectId(projectId, statusToFilterBy) {
    this.log.info(`InviteService: find invite with project id of ${projectId}`);

    const filter = { projectInvitedToId: projectId };
    InviteService.attachStatusToFilter(statusToFilterBy, filter);

    return this.inviteRepository.findAll({ where: filter });
  }

  /**
   * Gets all invites for the given user
   * @param userId the user id to find by
   * @param statusToFilterBy the status to filter invites by
   * @returns {Object} the invite that was found
   */
  async getInvitesByUserId(userId, statusToFilterBy) {
    this.log.info(`InviteService: find invite with user id of ${userId}`);

    const filter = { userInvitedId: userId };
    InviteService.attachStatusToFilter(statusToFilterBy, filter);

    return this.inviteRepository.findAll({ where: filter });
  }

  /**
   * Creates a new invite
   * @param projectId the id of the project to which the user is being invited to
   * @param userId the id of the user being invited
   * @param daysFromCreationUntilExpiration the number of days the invite will
   *   remain open before expiring
   * @param projectName the name of the project the user is invited to
   * @returns {Object} the created invite
   */
  async createInvite(projectId, userId, daysFromCreationUntilExpiration, projectName) {
    this.log.info(`InviteService: creating invite for user ${userId} to project ${projectId}`);

    const status = (daysFromCreationUntilExpiration === 0)
      ? InviteStatus.EXPIRED : InviteStatus.OPEN;
    const invite = {
      userInvitedId: userId,
      projectInvitedToId: projectId,
      projectName,
      status,
      daysFromCreationUntilExpiration
    };

    const errors = await InviteService.validateInvite(invite, true);
    if (errors.length !== 0) {
      throw new InvalidRequestException(errors);
    }

    let resultingInvite = null;
    try {
      resultingInvite = await this.inviteRepository.create(invite);
    } catch (err) {
      // SequelizeForeignKeyConstraintError for non-existant user or project
      throw new InvalidRequestException([
        new RequestParamError('user or project', 'Either the user or the project supplied to the invite service does not exist')
      ]);
    }
    return resultingInvite;
  }

  /**
   * Updates an invite
   * @param inviteId the id of the invite to update
   * @param status the updated status
   * @returns {Object} the updated invite
   */
  async updateInvite(inviteId, status) {
    this.log.info(`InviteService: update invite ${inviteId} to ${status}`);

    if (!isValidInviteStatus(status)) {
      throw new InvalidRequestException([new RequestParamError('status', getInvalidStatusMessage())]);
    }

    const foundInvite = await this.getInviteById(inviteId);
    if (foundInvite === null) {
      throw new InviteNotFoundException(`Invite ${inviteId} not found.`);
    }
    if (foundInvite.status !== InviteStatus.OPEN) {
      throw new InvalidRequestException([new RequestParamError('status', 'Only an OPEN invite can be accepted, rescinded, or declined.')]);
    }

    foundInvite.update({ status });
    return foundInvite;
  }
}
