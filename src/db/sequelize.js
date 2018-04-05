import config from 'config';
import Sequelize from 'sequelize';
import { getActiveLogger } from '../utils/winston';

// Added for convenience
const {
  STRING,
  BOOLEAN,
  UUID,
  UUIDV4
} = Sequelize.DataTypes;

const ToolType = {
  SOURCE_CONTROL: 'sourceControl',
  CONTAINERIZATION: 'containerization',
  CONTINUOUS_INTEGRATION: 'ci',
  DEPLOYMENT: 'deployment',
  WEB_FRAMEWORK: 'web',
  TEST: 'test',
  ORM: 'orm',
  SKADI: 'skadi'
};

const InviteStatus = {
  OPEN: 'open',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  RESCINDED: 'rescinded',
  EXPIRED: 'expired'
};

// Exports provided for convenience
module.exports.ToolType = ToolType;
module.exports.InviteStatus = InviteStatus;
module.exports.DataTypes = Sequelize.DataTypes;

let initialized = false;

function initManually(database, username, password, options) {
  if (initialized) {
    getActiveLogger().warn('Sequelize can only be initialized once!');
    return;
  }
  initialized = true;

  // Create the sequelize instance (once for the app)
  const model = new Sequelize(
    database,
    username,
    password,
    options
  );

  // --------------------------- MODEL DEFINITION START ---------------------------

  const User = model.define('user', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    username: { type: STRING, unique: true },
    email: STRING,
    firstName: STRING,
    lastName: STRING
  });

  const Credentials = model.define('credentials', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    password: { type: STRING, allowNull: false }
  });
  Credentials.belongsTo(User, { as: 'user', through: 'username' });

  const Client = model.define('client', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    clientId: { type: STRING, unique: true, allowNull: false },
    name: { type: STRING, allowNull: false },
    secret: { type: STRING, allowNull: false }
  });

  const AccessCode = model.define('accessCode', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    value: { type: STRING, allowNull: false },
    redirectURI: { type: STRING, allowNull: false }
  });
  AccessCode.belongsTo(User, { as: 'user', through: 'username' });

  const Token = model.define('Token', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    value: { type: STRING(2048), allowNull: false },
    expired: { type: BOOLEAN, defaultValue: false }
  });
  Token.belongsTo(User, { as: 'user', through: 'username' });

  const Tool = model.define('tool', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    name: { type: STRING, unique: true },
    toolType: {
      type: Sequelize.DataTypes.ENUM,
      values: [
        ToolType.SOURCE_CONTROL,
        ToolType.CONTINUOUS_INTEGRATION,
        ToolType.CONTAINERIZATION,
        ToolType.WEB_FRAMEWORK,
        ToolType.DEPLOYMENT,
        ToolType.TEST,
        ToolType.ORM,
        ToolType.SKADI

      ]
    },
    websiteUrl: STRING(2000),
    apiUrl: STRING(2000),
    documentationUrl: STRING(2000),
    logoSvgUrl: STRING(2000),
    logoLargeUrl: STRING(2000),
    logoSmallUrl: STRING(2000),
    usageRequirements: STRING(2000),
    specialConsiderations: STRING(2000)
  });


  const Project = model.define('project', {
    // owners, contributors, invites, and various tools defined below
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    projectName: STRING,
    description: STRING(1024),
    version: STRING,
    license: STRING,
    authors: STRING,
    githubRepositoryName: STRING,
    travisRepositoryName: STRING,
    herokuApplicationName: STRING,
    komaApiKey: STRING,
  }, {
    paranoid: true
  });

  Project.belongsTo(Tool, { as: 'containerizationTool' });
  Project.belongsTo(Tool, { as: 'continuousIntegrationTool' });
  Project.belongsTo(Tool, { as: 'deploymentTool' });
  Project.belongsTo(Tool, { as: 'webFramework' });
  Project.belongsTo(Tool, { as: 'sourceControl' });
  Project.belongsTo(Tool, { as: 'ormTool' });
  Project.belongsTo(Tool, { as: 'testTool' });

  const ProjectOwner = model.define('projectOwner', {
    // ASSOCIATIONS DEFINED BELOW
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    }
  });
  Project.belongsToMany(User, { as: 'owners', through: 'projectOwner' });
  User.belongsToMany(Project, { as: 'projectsOwned', through: 'projectOwner' });


  const ProjectContributor = model.define('projectContributor', {
    // ASSOCIATIONS DEFINED BELOW
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    }
  });
  Project.belongsToMany(User, { as: 'contributors', through: 'projectContributor' });
  User.belongsToMany(Project, { as: 'projectsContributed', through: 'projectContributor' });


  const Invite = model.define('invite', {
    // userInvited and projectInvitedTo defined below
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    projectName: STRING,
    status: {
      type: Sequelize.DataTypes.ENUM,
      values: [
        InviteStatus.OPEN,
        InviteStatus.ACCEPTED,
        InviteStatus.DECLINED,
        InviteStatus.RESCINDED,
        InviteStatus.EXPIRED
      ],
      defaultValue: InviteStatus.OPEN
    },
    daysFromCreationUntilExpiration: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 30
    }
  });
  Invite.belongsTo(User, { as: 'userInvited' });
  Invite.belongsTo(Project, { as: 'projectInvitedTo' });

  const GithubCredentials = model.define('githubCredentials', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    },
    username: STRING,
    token: STRING(2000)
  });

  const GithubCredentialsOwner = model.define('githubCredentialsOwner', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4,
    }
  });
  GithubCredentials.belongsToMany(User, { as: 'owner', through: 'githubCredentialsOwner' });
  User.belongsToMany(GithubCredentials, { as: 'githubCredentials', through: 'githubCredentialsOwner' });

  const TravisToken = model.define('travisToken', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4
    },
    token: STRING(2000)
  });

  const TravisTokenOwner = model.define('travisTokenOwner', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4
    }
  });
  TravisToken.belongsToMany(User, { as: 'owner', through: 'travisTokenOwner' });
  User.belongsToMany(TravisToken, { as: 'travisToken', through: 'travisTokenOwner' });

  const HerokuCredentials = model.define('herokuCredentials', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4
    },
    email: STRING,
    token: STRING(2000)
  });

  const HerokuCredentialsOwner = model.define('herokuCredentialsOwner', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV4
    }
  });
  HerokuCredentials.belongsToMany(User, { as: 'owner', through: 'herokuCredentialsOwner' });
  User.belongsToMany(HerokuCredentials, { as: 'herokuCredentials', through: 'herokuCredentialsOwner' });
  // --------------------------- MODEL DEFINITION END ---------------------------

  // Model Instance
  module.exports.model = model;

  // Model Objects
  module.exports.User = User;
  module.exports.Credentials = Credentials;
  module.exports.Client = Client;
  module.exports.AccessCode = AccessCode;
  module.exports.Token = Token;
  module.exports.Tool = Tool;
  module.exports.Invite = Invite;
  module.exports.Project = Project;
  module.exports.ProjectOwner = ProjectOwner;
  module.exports.ProjectContributor = ProjectContributor;
  module.exports.GithubCredentials = GithubCredentials;
  module.exports.GithubCredentialsOwner = GithubCredentialsOwner;
  module.exports.TravisToken = TravisToken;
  module.exports.TravisTokenOwner = TravisTokenOwner;
  module.exports.HerokuCredentials = HerokuCredentials;
  module.exports.HerokuCredentialsOwner = HerokuCredentialsOwner;
}

function initWithConfigs() {
  if (!initialized) {
    const db = config.get('db');
    initManually(db.database, db.username, db.password, db.options);
  }
}

module.exports.isInitialized = () => initialized;
/**
 * This function lets you initialize sequelize with the configuration file
 * @type {initWithConfigs}
 */
module.exports.initSequelize = initWithConfigs;
/**
 * This function, on the other hand, lets you initialize sequelize manually
 * @type {initManually}
 */
module.exports.initManually = initManually;
