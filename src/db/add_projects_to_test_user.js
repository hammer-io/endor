import sequelize from './sequelize';


// This script takes a username as an argument and adds various test data
// to his or her account. It makes that user an owner for project 'b1', a
// contributor for project 'b2', and an invitee for project 'b3'.
// It should only be run after running the import_test_data.js script.

function usageAndExit() {
  console.error("\nUSAGE: npm run addProjectsToTestUser <username>\n"); // eslint-disable-line
  process.exit(1);
}

export async function populateProjects(username) {
  const project1 = await sequelize.Project.findOne({ where: { id: 'b1' } });
  const project2 = await sequelize.Project.findOne({ where: { id: 'b2' } });
  const user = await sequelize.User.findOne({ where: { username } });
  await project1.addOwners(user);
  await project2.addContributors(user);
}

export async function populateInvites(username) {
  const user = await sequelize.User.findOne({ where: { username } });
  const project3 = await sequelize.Project.findOne({ where: { id: 'b3' } });
  await sequelize.Invite.create({
    id: 'd123',
    status: sequelize.InviteStatus.OPEN,
    userInvitedId: user.id,
    projectInvitedToId: project3.id,
    projectName: project3.projectName,
    daysFromCreationUntilExpiration: 30
  });
}

export async function populateAllTestData(username) {
  await populateProjects(username);
  await populateInvites(username);
}


/**
 * ---------------------------- MAIN ----------------------------
 * The main function only gets run if this file is run as a script
 */
function main(username) {
  // First, we need to initialize the data model
  sequelize.initSequelize();

  // Then, continue populating the test data
  populateAllTestData(username).then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}


// ---------------- If this is running as a script, call main ----------------
if (!module.parent) {
  process.argv.forEach((str) => {
    console.log(str);
  });
  if (process.argv.length > 1 && process.argv[2].length > 0) {
    const username = process.argv[2];
    console.log(`\nAdding '${username}' as owner of project b1, contributor to b2, and invited to b3.\n`);
    main(username);
  } else {
    usageAndExit();
  }
}
