import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import sequelizeStore from 'connect-session-sequelize';
import skadi from 'skadi-hammerio';
import config from 'config';

import * as auth from './routes/auth.routes';
import * as githubauth from './routes/githubauth.routes';
import * as travisauth from './routes/travisauth.routes';
import * as herokuauth from './routes/herokuauth.routes';
import * as client from './routes/client.routes';
import index from './routes/index.routes';
import * as projects from './routes/projects.routes';
import * as contributors from './routes/contributors.routes';
import * as users from './routes/users.routes';
import * as invites from './routes/invites.routes';
import * as tools from './routes/tools.routes';
import InviteService from './services/invites.service';
import ProjectService from './services/projects.service';
import sequelize from './db/sequelize';
import { getActiveLogger } from './utils/winston';
import * as owners from './routes/owners.routes';
import UserService from './services/users.service';
import AuthService from './services/auth.service';
import ClientService from './services/client.service';
import EmailService from './services/email.service';
import ToolsService from './services/tools.service';
import KomaService from './services/koma.service';
import GithubAuthenticationService from './services/githubauth.service';
import TravisAuthenticationService from './services/travisauth.service';
import HerokuAuthService from './services/herokuauth.service';

// Get various configuration details
getActiveLogger().info(`NODE_ENV = ${process.env.NODE_ENV}`);

// Initialize sequelize
const SequelizeStore = sequelizeStore(session.Store);
sequelize.initSequelize();

// Run Skadi for data monitoring
skadi.heartbeat();
skadi.osdata();

const app = express();

// middleware //
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  skadi.captureRequestData(req);
  next();
});

app.use(session({
  secret: config.get('session').secret,
  store: new SequelizeStore({
    db: sequelize.model
  }),
  saveUninitialized: true,
  resave: true
}));

// dependency injections //
const userService = new UserService(sequelize.User, sequelize.Credentials, getActiveLogger());
const githubAuthenticationService = new GithubAuthenticationService(
  sequelize.GithubCredentials,
  userService,
  getActiveLogger()
);
const travisAuthenticationService = new TravisAuthenticationService(
  sequelize.TravisToken,
  userService,
  githubAuthenticationService,
  getActiveLogger()
);

const herokuAuthenticationService = new HerokuAuthService(
  sequelize.HerokuCredentials,
  userService,
  getActiveLogger()
);

const projectService = new ProjectService(
  sequelize.Project,
  userService,
  githubAuthenticationService,
  travisAuthenticationService,
  herokuAuthenticationService,
  getActiveLogger()
);
const inviteService = new InviteService(sequelize.Invite, getActiveLogger());
const authService = new AuthService(sequelize.Token, sequelize.AccessCode, getActiveLogger());
const clientService = new ClientService(sequelize.Client, getActiveLogger());
const emailService = new EmailService(getActiveLogger());
const toolsService = new ToolsService(sequelize.Tool, getActiveLogger());
const komaService = new KomaService(getActiveLogger());

auth.setDependencies(userService, clientService, authService);
client.setDependencies(userService, clientService, authService);
projects.setProjectService(
  projectService,
  toolsService,
  githubAuthenticationService,
  herokuAuthenticationService,
  travisAuthenticationService,
  komaService
);
users.setDependencies(userService, githubAuthenticationService, herokuAuthenticationService);
contributors.setDependencies(projectService);
owners.setDependencies(projectService);
invites.setDependencies(inviteService, userService, projectService, emailService);
tools.setDependencies(toolsService);
githubauth.setDependencies(githubAuthenticationService);
travisauth.setDependencies(travisAuthenticationService);
herokuauth.setDependencies(herokuAuthenticationService);
// end dependency injections //

// API ENDPOINTS //
app.use('/', express.static('docs'));
app.use('/api', [index]);
app.use('/api/v1', [
  auth.router,
  client.router,
  projects.router,
  users.router,
  contributors.router,
  owners.router,
  invites.router,
  tools.router,
  githubauth.router,
  travisauth.router,
  herokuauth.router
]);
// END API ENDPOINTS //

// default 404 handler
// for url's that don't match a defined pattern
app.use((req, res) => {
  res.status(404).send({
    status: 404,
    message: 'Not Found',
    documentation_url: `http://${req.get('host')}`
  });
});

// Used for data monitoring (when there's no error)
app.use((req, res) => {
  skadi.captureResponseData(req, res);
});

// route error logging
// will print any errors that the middleware spits out
app.use((err, req, res, next) => {
  getActiveLogger().error(`Routing: ${req.method} ${req.originalUrl} : ${err}`);
  next(err);
});

// Used for data monitoring (when there IS an error)
app.use((err, req, res, next) => {
  skadi.captureResponseData(req, res);
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
// eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

app.listen(3000, () => {
  getActiveLogger().info('Endor has now started on port 3000!');
});

module.exports = app;
