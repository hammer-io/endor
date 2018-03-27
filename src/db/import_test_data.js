import bcrypt from 'bcrypt';
import sequelize from './sequelize';
import { defineTables, populateTools } from './init_database';
import * as encryptionUtil from '../utils/encryption';

// This file fills the database with data for testing

export async function populateUsers() {
  await sequelize.User.bulkCreate([
    {
      id: 'a1',
      username: 'BobSagat',
      email: 'hammer.io.team@gmail.com',
      firstName: 'Bob',
      lastName: 'Sagat'
    },
    {
      id: 'a2',
      username: 'globalwarmingguy56',
      email: 'hammer.io.team@gmail.com',
      firstName: 'Al',
      lastName: 'Gore'
    },
    {
      id: 'a3',
      username: 'jreach',
      email: 'hammer.io.team@gmail.com',
      firstName: 'Jack',
      lastName: 'Reacher'
    },
    {
      id: 'a4',
      username: 'johnnyb',
      email: 'hammer.io.team@gmail.com',
      firstName: 'Johnny',
      lastName: 'Bravo'
    },
    {
      id: 'a5',
      username: 'buddy',
      email: 'hammer.io.team@gmail.com',
      firstName: 'Buddy',
      lastName: 'Rich'
    }
  ]);

  const user1 = await sequelize.User.findOne({
    where: { username: 'johnnyb' }
  });
  const user2 = await sequelize.User.findOne({
    where: { username: 'globalwarmingguy56' }
  });
  const user3 = await sequelize.User.findOne({
    where: { username: 'jreach' }
  });
  const user4 = await sequelize.User.findOne({
    where: { username: 'BobSagat' }
  });
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash('plaintext1', salt);
  const cred1 = await sequelize.Credentials.create({
    password: pass
  });
  const cred2 = await sequelize.Credentials.create({
    password: pass
  });
  const cred3 = await sequelize.Credentials.create({
    password: pass
  });
  const cred4 = await sequelize.Credentials.create({
    password: pass
  });
  await cred1.setUser(user1);
  await cred2.setUser(user2);
  await cred3.setUser(user3);
  await cred4.setUser(user4);
}

export async function populateClients() {
  await sequelize.Client.bulkCreate([
    {
      id: 'c1',
      name: 'endor_frontend1',
      clientId: 'clientId',
      secret: 'client_secret'
    },
    {
      id: 'c2',
      name: 'endor_frontend1',
      clientId: 'clientId1',
      secret: 'client_secret'
    },
    {
      id: 'c3',
      name: 'endor_frontend1',
      clientId: 'clientId2',
      secret: 'client_secret'
    }
  ]);
}

export async function populateProjects() {
  const project1 = await sequelize.Project.create({
    id: 'b1',
    projectName: 'TMNT',
    description: 'You gotta know what a crumpet is to understand cricket!',
    version: '1.2.3',
    license: 'MIT',
    authors: 'Casey Jones, Raphael'
  });
  const project2 = await sequelize.Project.create({
    id: 'b2',
    projectName: 'hammer-io',
    description: 'Hit it with a hammer!',
    version: '1.2.3',
    license: 'MIT',
    authors: 'Jack'
  });
  const project3 = await sequelize.Project.create({
    id: 'b3',
    projectName: 'drumitdown',
    description: 'Let us drum it down for you',
    version: '3.2.1',
    license: 'MIT',
    authors: 'Krash'
  });

  // Add project owners
  const user1 = await sequelize.User.findOne({
    where: { username: 'johnnyb' }
  });
  const user2 = await sequelize.User.findOne({
    where: { username: 'globalwarmingguy56' }
  });
  const user3 = await sequelize.User.findOne({
    where: { username: 'jreach' }
  });
  const user4 = await sequelize.User.findOne({
    where: { username: 'BobSagat' }
  });
  await project1.addOwners(user1);
  await project2.addOwners([user1, user2, user4]);
  // Another way to do it (might be useful later)
  // await user2.addProjectsOwned(project);

  // Add project contributors
  await project1.addContributors([user2, user3, user4]);
  await project2.addContributors([user3]);

  await project3.addOwners([user1]);

  // Add tooling
  const depTools = await sequelize.Tool.findAll({
    where: { toolType: sequelize.ToolType.DEPLOYMENT }
  });
  await project1.setDeploymentTool(depTools[0]);
  const ciTools = await sequelize.Tool.findAll({
    where: { toolType: sequelize.ToolType.CONTINUOUS_INTEGRATION }
  });
  await project1.setContinuousIntegrationTool(ciTools[0]);
}

export async function populateInvites() {
  const userJreach = await sequelize.User.findOne({
    where: { username: 'jreach' }
  });
  const userBuddy = await sequelize.User.findOne({
    where: { username: 'buddy' }
  });
  const projectHammerIo = await sequelize.Project.findOne({
    where: { projectName: 'hammer-io' }
  });
  const projectDrumItDown = await sequelize.Project.findOne({
    where: { projectName: 'drumitdown' }
  });

  // Jreach invited to hammer-io
  await sequelize.Invite.create({
    id: 'd1',
    status: sequelize.InviteStatus.OPEN,
    userInvitedId: userJreach.id,
    projectInvitedToId: projectHammerIo.id,
    projectName: projectHammerIo.projectName,
    daysFromCreationUntilExpiration: 30
  });
  // Buddy invited to hammer-io and drumitdown, but he declined
  await sequelize.Invite.create({
    id: 'd2',
    status: sequelize.InviteStatus.DECLINED,
    userInvitedId: userBuddy.id,
    projectInvitedToId: projectHammerIo.id,
    projectName: projectHammerIo.projectName,
    daysFromCreationUntilExpiration: 15
  });
  await sequelize.Invite.create({
    id: 'd3',
    // status: sequelize.InviteStatus.OPEN,    -- Defaults to OPEN
    userInvitedId: userBuddy.id,
    projectInvitedToId: projectDrumItDown.id,
    projectName: projectDrumItDown.projectName
    // daysFromCreationUntilExpiration: 30     -- Default to 30
  });
}

export async function populateAccessCodes() {
  await sequelize.AccessCode.bulkCreate([
    {
      value: 'randomValue',
      redirectURI: 'http://localhost:3000/api/v1/oauth2/authorize/successRedirect',
      userId: 'a3'
    },
    {
      value: 'randomValueAgain',
      redirectURI: 'http://localhost:3000/api/v1/oauth2/authorize/successRedirect',
      userId: 'a4'
    }
  ]);
}

export async function populateTokens() {
  await sequelize.Token.bulkCreate([
    {
      id: '1',
      value: 'longRandomTokenValue',
      expired: false,
      userId: 'a3'
    },
    {
      id: '2',
      value: 'anotherLongRandomUnpredictableTokenValue',
      expired: false,
      userId: 'a3'
    }
  ]);
}

export async function populateGithubAuth() {
  const token = 'this is a fake token';
  const githubTokenToBeCreated = {
    token: encryptionUtil.encrypt(token.toString()),
    username: 'johnnyBUsername'
  };

  const userJohnny = await sequelize.User.findOne({
    where: { username: 'johnnyb' }
  });
  const tokenCreated = await sequelize.GithubCredentials.create(githubTokenToBeCreated);
  await userJohnny.addGithubCredentials(tokenCreated);
}

export async function populateHerokuAuth() {
  const token = 'this is a fake token';
  const herokuTokenToBeCreated = {
    token: encryptionUtil.encrypt(token.toString()),
    username: 'johnnyBUsername'
  };

  const userJohnny = await sequelize.User.findOne({
    where: { username: 'johnnyb' }
  });
  const tokenCreated = await sequelize.HerokuCredentials.create(herokuTokenToBeCreated);
  await userJohnny.addHerokuCredentials(tokenCreated);
}

export async function populateTravisAuth() {
  const token = 'this is a fake token';
  const travisTokenToBeCreated = {
    token: encryptionUtil.encrypt(token.toString()),
    email: 'johnnyBEmail@email.com'
  };

  const userJohnny = await sequelize.User.findOne({
    where: { username: 'johnnyb' }
  });
  const tokenCreated = await sequelize.TravisCredentials.create(travisTokenToBeCreated);
  await userJohnny.addTravisCredentials(tokenCreated);
}

/**
 * This should be the primary entry method to populate all test data.
 * @param purgeOldData boolean if true will re-initialize database, overwriting old data
 * @returns {Promise.<void>}
 */
export async function populateAllTestData(purgeOldData) {
  if (purgeOldData) {
    await defineTables();
    await populateTools();
  }
  await populateUsers();
  await populateProjects();
  await populateInvites();
  await populateAccessCodes();
  await populateTokens();
  await populateClients();
  await populateGithubAuth();
  await populateHerokuAuth();
  await populateTravisAuth();
}


/**
 * ---------------------------- MAIN ----------------------------
 * The main function only gets run if this file is run as a script
 */
function main() {
  // First, we need to initialize the data model
  sequelize.initSequelize();

  // Then, continue populating the test data
  populateAllTestData(false).then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}


// ---------------- If this is running as a script, call main ----------------
if (!module.parent) {
  main();
}
