import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import config from 'config';

import * as auth from './routes/auth.routes';
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

// Get various configuration details
const emailFromAddress = config.get('email.from');
const emailTransportOptions = config.get('email.transport');
let db = config.get('db');
if (process.env.NODE_ENV === 'test') {
  db = config.get('dbTest');
}

if (!sequelize.isInitialized()) {
  // Initialize the data model
  sequelize.initSequelize(
    db.database,
    db.username,
    db.password,
    db.options
  );
}

const app = express();

// middleware //
app.use(helmet());
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: config.get('session').secret,
  saveUninitialized: true,
  resave: true
}));

// dependency injections //
const userService = new UserService(sequelize.User, sequelize.Credentials, getActiveLogger());
const projectService = new ProjectService(sequelize.Project, userService, getActiveLogger());
const inviteService = new InviteService(sequelize.Invite, getActiveLogger());
const authService = new AuthService(sequelize.Token, sequelize.AccessCode, getActiveLogger());
const clientService = new ClientService(sequelize.Client, getActiveLogger());
const emailService = new EmailService(emailFromAddress, getActiveLogger(), emailTransportOptions);
const toolsService = new ToolsService(sequelize.Tool, getActiveLogger());
auth.setDependencies(userService, clientService, authService);
client.setDependencies(userService, clientService, authService);
projects.setProjectService(projectService);
users.setDependencies(userService);
contributors.setDependencies(projectService);
owners.setDependencies(projectService);
invites.setDependencies(inviteService, userService, projectService, emailService);
tools.setDependencies(toolsService);
// end dependency injections //

// API ENDPOINTS //
app.use('/', express.static('docs'));
app.use('/api', [index]);
app.use('/api/v1', [auth.router, client.router, projects.router, users.router, contributors.router, owners.router, invites.router, tools.router]);
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

// route error logging
// will print any errors that the middleware spits out
app.use((err, req, res, next) => {
  getActiveLogger().error(`Routing: ${req.method} ${req.originalUrl} : ${err}`);
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

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

app.listen(3000, () => {
  console.log('Yggdrasil has now started on port 3000!');
});

module.exports = app;
