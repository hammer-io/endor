import { expect } from 'chai';
import sequelize from '../../src/db/sequelize';
import { populateAllTestData } from '../../src/db/import_test_data';
import AuthService from '../../src/services/auth.service';
import { getMockLogger } from '../util/mockLogger';
import '../globalSetupTeardown.test';
import UserService from '../../src/services/users.service';

const userService = new UserService(sequelize.User, sequelize.credentials, getMockLogger());
const githubAuthService = new AuthService(sequelize.GithubCredentials, userService, getMockLogger());


describe('Testing GithubAuth Service', () => {
  beforeEach(async () => {
    await populateAllTestData(true);
  });

});