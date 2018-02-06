[![Build Status](https://travis-ci.org/hammer-io/endor.svg?branch=master)](https://travis-ci.org/hammer-io/endor)

# endor

A web API to generate node.js applications in an opinionated way.

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Setting up the Database](#setting-up-the-database)
- [Querying the Data Model](#querying-the-data-model)
- [Authentication](#authentication)
- [Permissions](#permissions)
- [Email Setup](#email-setup)
- [Deployment Instructions](https://github.com/hammer-io/endor/blob/master/DEPLOYMENT.md)


## Installation

### Installation for Development
1. Fork this repository
2. Open your favorite terminal and go to the directory you want to install.
3. git clone https://github.com/username/endor
4. `npm install`
5. You're all set!


## Usage
`npm start`: starts the API server on `localhost:3000`

`npm test`: runs the test suite

`npm run lint`: runs the linter


## Documentation

Documentation is generated and displayed using [apidoc](http://apidocjs.com/).

### Generate Documenation
1. Prereq: `npm install apidoc -g`
2. Then run: `apidoc -i src/ -o docs/`

### View Documentation
1. `npm start`
2. visit `localhost:3000/`


## Setting up the Database

Run `npm run createDB && npm run initDB` to create the database and
initialize the tables within it.


## Querying the Data Model

- [Sequelize Querying Tutorial](http://docs.sequelizejs.com/manual/tutorial/querying.html)
- [Various Sequelize Query Methods](http://docs.sequelizejs.com/class/lib/model.js~Model.html)

**Example Usage:**

```javascript
import sequelize from './db/sequelize';

// Query the model for all users with username = 'Jack'
// and then print all projects owned by those users
sequelize.User.findAll({
  where: { firstName: 'Jack' }
}).then((users) => {
  users.forEach((user) => {
    console.log(`[*] ${user.dataValues.username} owns the following:`);
    user.getProjectsOwned().then((projects) => {
      projects.forEach((project) => {
        console.log(`[*] ${project.dataValues.projectName}`);
      });
    })
  });
}).catch((err) => {
  console.error(err);
});
```


## Authentication

### Basic-Auth
Uses the user's username and password in the Authentication header to authenticate
the user.

### Bearer
A token is used to authenticate the user.

**To exchange a user name and password for auth-token:**
       
* Post a new Token - post /oauth2/token
    - Use a request body similar to the JSON below to retrieve a token for the user with the given username and password 
    - Returns authentication token
```json
{
    "username": "<username>",
    "password": "<password>",
    "grant_type": "password"
} 
```
* To login with the user
    - The token can be used as authentication for any endpoint, but GET /auth/token will verify the token is valid
        - Simply set the Authorization header with the token and make the request.  If it returns 200, the token is valid.
    - If the token has been lost, post a new token as described above

**Note:** All steps must be authenticated, posting a token requires Client-Basic


## Permissions

The middleware for checking if a user is authorized to view certain data is contained in the 
authorization folder. The authorization middleware requires specific naming of the parameters
as detailed below and the endpoint must be authenticated to verify the identity of the user
making the requests.

- For project authorization, the projectId must be labeled as such in the request's params.
  There are two levels: Owner level (the user must be an owner of the project)
  or Contributor level (the user must be a contributor or an owner).
- For user authorization, the username/id must be labeled as user and be located in the
  request's params.  There is only one level: User level (the user must be the one editing
  themselves.)


## Email Setup

For more information on using the email templates, view the
[zurb-email-templates README](https://github.com/hammer-io/endor/tree/master/zurb-email-templates#using-the-zurb-email-templates).

Endor uses the [Nodemailer](https://nodemailer.com/about/) module for sending emails.
For development and testing, we're using [Ethereal](https://ethereal.email/) to mock
sending emails. From their website:

> Ethereal is a fake SMTP service, mostly aimed at Nodemailer users (but not limited
> to). It's a completely free anti-transactional email service where messages never
> get delivered.

Any time you run the tests, the output will include a link to preview the email that
was just sent. Scroll up to the email service test, and you'll see an email preview
URL. Copy/paste that into your browser to see the email as it would have been delivered
to a real user.
