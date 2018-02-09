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
  constructor(projectId, statusFilter) {
    super({
      params: {
        projectId: projectId
      },
      query: {
        status: statusFilter
      }
    });
  }
}

describe('Testing Invite Controller', () => {
  before(() => {
    // Initialize the controller
    controller.setEmailService(mockEmailService);
    controller.setInviteService(inviteService);
    controller.setProjectService(projectService);
    controller.setUserService(userService);
  });

  beforeEach(async () => {
    await defineTables();
    await populateUsers();
    await populateProjects();
    await populateInvites();
  });

  describe('Get invites by project id', async () => {
    it('should ', async () => {
      const projectId = 'b2';
      const mock = new MockInviteRouteData(projectId, null);
      const result = await controller.getInvitesByProjectId(
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
  });

  describe('Get invites by user id', async () => {
  });

  describe('Get invites by authenticated user', async () => {
  });

  describe('Add invites to project', async () => {
  });

  describe('Update invite', async () => {
    describe('Accept invite', async () => {
    });

    describe('Decline Invite', async () => {
    });

    describe('Rescind Invite', async () => {
    });
  });
});
