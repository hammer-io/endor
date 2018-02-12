import { expect } from 'chai';

import * as controller from '../../src/controllers/invites.controller';
import sequelize from '../../src/db/sequelize';
import MockEmailService from '../util/mockEmailService';
import MockRouteData from '../util/mockRouteData';
import InviteService from '../../src/services/invites.service';
import ProjectService from '../../src/services/projects.service';
import UserService from '../../src/services/users.service';
import { assertInvite } from '../util/assertions';
import { defineTables } from '../../src/db/init_database';
import { populateUsers, populateProjects, populateInvites } from '../../src/db/import_test_data';
import { getMockLogger } from '../util/mockLogger';

// Initialize the data model
sequelize.initSequelize();
const InviteStatus = sequelize.InviteStatus;

// Initialize the various services used by the controller
const mockEmailService = new MockEmailService('"Holmgang" <holmgang@hammer-io.github.io>', getMockLogger(), null);
const inviteService = new InviteService(sequelize.Invite, getMockLogger());
const userService = new UserService(sequelize.User, sequelize.Credentials, getMockLogger());
const projectService = new ProjectService(sequelize.Project, userService, getMockLogger());


class MockInviteRouteData extends MockRouteData {
  constructor(params, statusFilter = null, body = null) {
    super({
      params,
      query: {
        status: statusFilter
      },
      body
    });
  }
}

describe('Testing Invite Controller', () => {
  before(async () => {
    // Initialize the controller
    await controller.setEmailService(mockEmailService);
    await controller.setInviteService(inviteService);
    await controller.setProjectService(projectService);
    await controller.setUserService(userService);
    await defineTables();
    await populateUsers();
    await populateProjects();
    await populateInvites();
  });

  describe('Get invites by project id', async () => {
    it('should return an array of invites to the project', async () => {
      const projectId = 'b2';
      const mock = new MockInviteRouteData({ projectId });
      const result = await controller.getInvitesByProjectId(mock.req, mock.res, mock.next());
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      expect(Array.isArray(mock.sent)).to.equal(true);
      expect(mock.sent.length).to.equal(2);
      assertInvite(mock.sent[0], {
        status: InviteStatus.OPEN,
        days: 30,
        userId: 'a3',
        projectId: projectId
      });
      assertInvite(mock.sent[1], {
        status: InviteStatus.DECLINED,
        days: 15,
        userId: 'a5',
        projectId: projectId
      });
    });
    it('should filter by status if a status is provided in the query string', async () => {
      const projectId = 'b2';
      const mock = new MockInviteRouteData({ projectId }, InviteStatus.OPEN);
      const result = await controller.getInvitesByProjectId(mock.req, mock.res, mock.next());
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      expect(Array.isArray(mock.sent)).to.equal(true);
      expect(mock.sent.length).to.equal(1);
      assertInvite(mock.sent[0], {
        status: InviteStatus.OPEN,
        days: 30,
        userId: 'a3',
        projectId: projectId
      });
    });
    it('should return an empty array for a non-existent project', async () => {
      const projectId = 'b22222';
      const mock = new MockInviteRouteData({ projectId });
      const result = await controller.getInvitesByProjectId(mock.req, mock.res, mock.next());
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      expect(Array.isArray(mock.sent)).to.equal(true);
      expect(mock.sent.length).to.equal(0);
    });
  });

  describe('Get invites by user', async () => {
    it('should return an array of invites for the user', async () => {
      const user = 'a5';
      const mock = new MockInviteRouteData({ user });
      const result = await controller.getInvitesByUserId(mock.req, mock.res, mock.next());
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      expect(Array.isArray(mock.sent)).to.equal(true);
      expect(mock.sent.length).to.equal(2);
      assertInvite(mock.sent[0], {
        status: InviteStatus.DECLINED,
        days: 15,
        userId: user,
        projectId: 'b2'
      });
      assertInvite(mock.sent[1], {
        status: InviteStatus.OPEN,
        days: 30,
        userId: user,
        projectId: 'b3'
      });
    });
    it('should filter by status if a status is provided in the query string', async () => {
      const user = 'a5';
      const mock = new MockInviteRouteData({ user }, InviteStatus.OPEN);
      const result = await controller.getInvitesByUserId(mock.req, mock.res, mock.next());
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      expect(Array.isArray(mock.sent)).to.equal(true);
      expect(mock.sent.length).to.equal(1);
      assertInvite(mock.sent[0], {
        status: InviteStatus.OPEN,
        days: 30,
        userId: user,
        projectId: 'b3'
      });
    });
    it('should return an empty array if the user doesn\'t exist', async () => {
      const user = 'a5555555';
      const mock = new MockInviteRouteData({ user });
      const result = await controller.getInvitesByUserId(mock.req, mock.res, mock.next());
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      expect(Array.isArray(mock.sent)).to.equal(true);
      expect(mock.sent.length).to.equal(0);
    });
  });

  describe('Get invites by authenticated user', async () => {
    it('should return an array of invites for the user', async () => {
      const userId = 'a5';
      const user = await sequelize.User.findOne({ where: { id: userId }});
      // Auth normally sets the user, so we set it manually here in the mock
      const mock = new MockRouteData({
        params: {},
        user,
        query: {}
      });
      const result = await controller.getInvitesByAuthenticatedUser(
        mock.req,
        mock.res,
        mock.next()
      );
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      expect(Array.isArray(mock.sent)).to.equal(true);
      expect(mock.sent.length).to.equal(2);
      assertInvite(mock.sent[0], {
        status: InviteStatus.DECLINED,
        days: 15,
        userId: userId,
        projectId: 'b2'
      });
      assertInvite(mock.sent[1], {
        status: InviteStatus.OPEN,
        days: 30,
        userId: userId,
        projectId: 'b3'
      });
    });
    it('should filter by status if a status is provided in the query string', async () => {
      const userId = 'a5';
      const user = await sequelize.User.findOne({ where: { id: userId }});
      // Auth normally sets the user, so we set it manually here in the mock
      const mock = new MockRouteData({
        params: {},
        user,
        query: {
          status: InviteStatus.DECLINED
        }
      });
      const result = await controller.getInvitesByAuthenticatedUser(
        mock.req,
        mock.res,
        mock.next()
      );
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      expect(Array.isArray(mock.sent)).to.equal(true);
      expect(mock.sent.length).to.equal(1);
      assertInvite(mock.sent[0], {
        status: InviteStatus.DECLINED,
        days: 15,
        userId: userId,
        projectId: 'b2'
      });
    });
    it('should return an empty array if the user has no invites', async () => {
      const userId = 'a1';
      const user = await sequelize.User.findOne({ where: { id: userId }});
      // Auth normally sets the user, so we set it manually here in the mock
      const mock = new MockRouteData({
        params: {},
        user,
        query: {}
      });
      const result = await controller.getInvitesByAuthenticatedUser(
        mock.req,
        mock.res,
        mock.next()
      );
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      expect(Array.isArray(mock.sent)).to.equal(true);
      expect(mock.sent.length).to.equal(0);
    });
  });

  describe('Add or update invites', async () => {
    beforeEach(async () => {
      await defineTables();
      await populateUsers();
      await populateProjects();
      await populateInvites();
    });

    it('Add invite to project should work (happy path)', async () => {
      const projectId = 'b1';
      const user = 'a1';
      const body = {
        daysFromCreationUntilExpiration: 7
      };
      const mock = new MockInviteRouteData({ projectId, user }, null, body);
      const result = await controller.addInviteToProject(mock.req, mock.res, mock.next());
      expect(result).to.equal(undefined);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      mock.assertStatusCode(201);
      expect(Array.isArray(mock.sent)).to.equal(false);
      assertInvite(mock.sent, {
        status: InviteStatus.OPEN,
        days: 7,
        userId: user,
        projectId: projectId
      });
    });

    it('Add invite to project should fail if project doesn\'t exist', async () => {
      const projectId = 'b1234';
      const user = 'a1';
      const body = {
        daysFromCreationUntilExpiration: 7
      };
      const mock = new MockInviteRouteData({ projectId, user }, null, body);
      const result = await controller.addInviteToProject(mock.req, mock.res, mock.next());
      expect(result).to.equal(undefined);
      mock.assertWasSent(false);
      mock.assertWasNexted(true);
      expect(mock.nexted.message).to.equal('Project with id b1234 not found');
    });

    it('Add invite to project should fail if user doesn\'t exist', async () => {
      const projectId = 'b1';
      const user = 'a1234';
      const body = {
        daysFromCreationUntilExpiration: 7
      };
      const mock = new MockInviteRouteData({ projectId, user }, null, body);
      const result = await controller.addInviteToProject(mock.req, mock.res, mock.next());
      expect(result).to.equal(undefined);
      mock.assertWasSent(false);
      mock.assertWasNexted(true);
      expect(mock.nexted.message).to.equal('User with a1234 could not be found.');
    });

    it('Accept invite should update the invite and add a contributor to the project', async () => {
      // First, make sure the project doesn't have the user as a contributor
      const drumitdown = await sequelize.Project.findOne({
        where: { projectName: 'drumitdown' }
      });
      const buddy = await sequelize.User.findOne({
        where: { username: 'buddy' }
      });
      let projectContributor = await sequelize.ProjectContributor.findOne({
        where: {
          projectId: drumitdown.id,
          userId: buddy.id
        }
      });
      expect(projectContributor).to.equal(null);

      // Now, accept the invite
      const inviteId = 'd3';
      const mock = new MockInviteRouteData({ id: inviteId });
      const result = await controller.acceptInvite(mock.req, mock.res, mock.next());
      expect(result).to.equal(mock.sent);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      mock.assertStatusCode(201);

      // Make sure invite was updated
      assertInvite(mock.sent, {
        status: InviteStatus.ACCEPTED,
        days: 30,
        userId: 'a5',
        projectId: 'b3'
      });

      // Finally, make sure user was added as contributor
      projectContributor = await sequelize.ProjectContributor.findOne({
        where: {
          projectId: drumitdown.id,
          userId: buddy.id
        }
      });
      expect(projectContributor.userId).to.equal(buddy.id);
    });

    it('Accept invite should fail if the invite isn\'t open', async () => {
      // First, make sure the project doesn't have the user as a contributor
      const hammerio = await sequelize.Project.findOne({
        where: { projectName: 'hammer-io' }
      });
      const buddy = await sequelize.User.findOne({
        where: { username: 'buddy' }
      });
      let projectContributor = await sequelize.ProjectContributor.findOne({
        where: {
          projectId: hammerio.id,
          userId: buddy.id
        }
      });
      expect(projectContributor).to.equal(null);

      // Now, accept the invite
      const inviteId = 'd2'; // a declined invite
      const mock = new MockInviteRouteData({ id: inviteId });
      const result = await controller.acceptInvite(mock.req, mock.res, mock.next());
      expect(result).to.equal(false);
      mock.assertWasSent(false);
      mock.assertWasNexted(true);
      expect(mock.nexted.errors[0].message).to.equal('Only an OPEN invite can be accepted, rescinded, or declined.');

      // Finally, make sure user was NOT added as contributor
      projectContributor = await sequelize.ProjectContributor.findOne({
        where: {
          projectId: hammerio.id,
          userId: buddy.id
        }
      });
      expect(projectContributor).to.equal(null);
    });

    it('Rescind invite should work (happy path)', async () => {
      const inviteId = 'd1';
      const mock = new MockInviteRouteData({ id: inviteId });
      const result = await controller.rescindInvite(mock.req, mock.res, mock.next());
      expect(result).to.equal(mock.sent);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      mock.assertStatusCode(201);
      assertInvite(mock.sent, {
        status: InviteStatus.RESCINDED,
        days: 30,
        userId: 'a3',
        projectId: 'b2'
      });
    });

    it('Decline invite should work (happy path)', async () => {
      const inviteId = 'd1';
      const mock = new MockInviteRouteData({ id: inviteId });
      const result = await controller.declineInvite(mock.req, mock.res, mock.next());
      expect(result).to.equal(mock.sent);
      mock.assertWasSent(true);
      mock.assertWasNexted(false);
      mock.assertStatusCode(201);
      assertInvite(mock.sent, {
        status: InviteStatus.DECLINED,
        days: 30,
        userId: 'a3',
        projectId: 'b2'
      });
    });

    it('Update invite should fail if the invite doesn\'t exist', async () => {
      const inviteId = 'd1234';
      const mock = new MockInviteRouteData({ id: inviteId });
      const result = await controller.declineInvite(mock.req, mock.res, mock.next());
      expect(result).to.equal(false);
      mock.assertWasSent(false);
      mock.assertWasNexted(true);
      expect(mock.nexted.message).to.equal('Invite with id d1234 could not be found.');
    });
  });
});
