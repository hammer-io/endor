/* eslint-disable import/prefer-default-export,max-len */
import express from 'express';
import * as toolsController from '../controllers/tools.controller';

export const router = express.Router();

/**
 * @api {get} /tools Get  tools
 * @apiVersion 1.0.0
 * @apiName get tools
 * @apiGroup Tools
 *
 * @apiPermission none
 *
 * @apiSuccess {Object[]} tools Returns a list of all tools.
 * @apiSuccessExample {json} Success-Response:
 * [
 {
     "id": "0a75985f-d2da-4c9b-a346-f49697dc1452",
     "name": "Heroku",
     "toolType": "deployment",
     "websiteUrl": "https://www.heroku.com/",
     "apiUrl": "https://api.heroku.com/",
     "documentationUrl": "https://devcenter.heroku.com/",
     "logoSvgUrl": "data:image/svg+xml;utf8,<svg width=\"27\" height=\"30\" viewBox=\"0 0 27 30\" xmlns=\"http://www.w3.org/2000/svg\"><title>heroku-logo</title><path d=\"M3 0C1.13 0 0 1.11 0 2.903v24.194C0 28.883 1.13 30 3 30h21c1.863 0 3-1.11 3-2.903V2.903C26.994 1.11 25.863 0 24 0H3zm21.042 2c.508.006.958.448.958.929V27.07c0 .487-.45.929-.958.929H2.958C2.45 28 2 27.558 2 27.071V2.93c0-.488.45-.93.958-.93h21.084zM20 25h-2.781v-8.506c0-.774-.237-1.048-.468-1.208-1.396-.959-5.414-.042-7.834.916L7 17.012 7.006 5h2.816v7.917a20.99 20.99 0 0 1 1.882-.482c2.988-.643 5.184-.47 6.616.505.787.536 1.68 1.59 1.68 3.554V25zm-6-15h3.293A16.109 16.109 0 0 0 20 5h-3.287c-.49 1.188-1.385 3.188-2.713 5zM7 25v-7l3 3.5L7 25z\" fill=\"%239E7CC1\" fill-rule=\"evenodd\"/></svg>",
     "logoLargeUrl": "https://status.heroku.com/images/favicon-4d37b8350e89706867dad5caab4af5e5.ico",
     "logoSmallUrl": "https://id.heroku.com/assets/logo-vertical.png",
     "usageRequirements": "You must have created a Heroku account before using this tool.",
     "specialConsiderations": null,
     "createdAt": "2018-02-05T21:46:46.000Z",
     "updatedAt": "2018-02-05T21:46:46.000Z"
 },
 {
     "id": "263d489d-e0b1-4d51-a7cc-ed85d84113cc",
     "name": "GitHub",
     "toolType": "sourceControl",
     "websiteUrl": "https://github.com/",
     "apiUrl": "https://api.github.com/",
     "documentationUrl": "https://developer.github.com/v3/",
     "logoSvgUrl": null,
     "logoLargeUrl": "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png",
     "logoSmallUrl": null,
     "usageRequirements": null,
     "specialConsiderations": null,
     "createdAt": "2018-02-05T21:46:46.000Z",
     "updatedAt": "2018-02-05T21:46:46.000Z"
 },
 {
     "id": "66e5470e-294e-4d8a-99dd-ab09137909ce",
     "name": "Docker",
     "toolType": "containerization",
     "websiteUrl": "https://docker.com/",
     "apiUrl": "https://index.docker.io/v1/",
     "documentationUrl": "https://docs.docker.com/",
     "logoSvgUrl": null,
     "logoLargeUrl": "https://www.docker.com/sites/default/files/vertical_large.png",
     "logoSmallUrl": "https://www.docker.com/sites/default/files/vertical_small.png",
     "usageRequirements": null,
     "specialConsiderations": null,
     "createdAt": "2018-02-05T21:46:46.000Z",
     "updatedAt": "2018-02-05T21:46:46.000Z"
 }
 ]
 */
router.get('/tools', toolsController.getTools);

/**
 * @api {get} /tools/sourcecontrol Get  source control tools
 * @apiVersion 1.0.0
 * @apiName get source control tools
 * @apiGroup Tools
 *
 * @apiPermission none
 *
 * @apiSuccess {Object[]} tools Returns a list of all source control tools.
 * @apiSuccessExample {json} Success-Response:
 * [
 {
     "id": "263d489d-e0b1-4d51-a7cc-ed85d84113cc",
     "name": "GitHub",
     "toolType": "sourceControl",
     "websiteUrl": "https://github.com/",
     "apiUrl": "https://api.github.com/",
     "documentationUrl": "https://developer.github.com/v3/",
     "logoSvgUrl": null,
     "logoLargeUrl": "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png",
     "logoSmallUrl": null,
     "usageRequirements": null,
     "specialConsiderations": null,
     "createdAt": "2018-02-05T21:46:46.000Z",
     "updatedAt": "2018-02-05T21:46:46.000Z"
 }
 ]
 */
router.get('/tools/sourcecontrol', toolsController.getSourceControlTools);

/**
 * @api {get} /tools/ci Get  continuous integration tools
 * @apiVersion 1.0.0
 * @apiName get continuous integration tools
 * @apiGroup Tools
 *
 * @apiPermission none
 *
 * @apiSuccess {Object[]} tools Returns a list of all continuous integration tools.
 * @apiSuccessExample {json} Success-Response:
 * [
   {
   "id": "8dfcba69-fd36-4fde-a492-c4af7db13e66",
   "name": "TravisCI",
   "toolType": "ci",
   "websiteUrl": "https://travis-ci.org/",
   "apiUrl": "https://api.travis-ci.org/",
   "documentationUrl": "https://docs.travis-ci.com/api",
   "logoSvgUrl": "https://travis-ci.com/images/logos/TravisCI-Mascot-1.svg",
   "logoLargeUrl": "https://travis-ci.com/images/logos/TravisCI-Mascot-1.png",
   "logoSmallUrl": null,
   "usageRequirements": "You must have created a TravisCI open source account before using this tool.",
   "specialConsiderations": "To use the open source version of TravisCI, you must have a GitHub account.",
   "createdAt": "2018-02-05T21:46:46.000Z",
   "updatedAt": "2018-02-05T21:46:46.000Z"
   }
 ]
 */
router.get('/tools/ci', toolsController.getCITools);

/**
 * @api {get} /tools/containerization Get  containerization tools
 * @apiVersion 1.0.0
 * @apiName get containerization tools
 * @apiGroup Tools
 *
 * @apiPermission none
 *
 * @apiSuccess {Object[]} tools Returns a list of all containerization tools.
 * @apiSuccessExample {json} Success-Response:
 * [
    {
        "id": "66e5470e-294e-4d8a-99dd-ab09137909ce",
        "name": "Docker",
        "toolType": "containerization",
        "websiteUrl": "https://docker.com/",
        "apiUrl": "https://index.docker.io/v1/",
        "documentationUrl": "https://docs.docker.com/",
        "logoSvgUrl": null,
        "logoLargeUrl": "https://www.docker.com/sites/default/files/vertical_large.png",
        "logoSmallUrl": "https://www.docker.com/sites/default/files/vertical_small.png",
        "usageRequirements": null,
        "specialConsiderations": null,
        "createdAt": "2018-02-05T21:46:46.000Z",
        "updatedAt": "2018-02-05T21:46:46.000Z"
    }
 ]
 */
router.get('/tools/containerization', toolsController.getContainerizationTools);

/**
 * @api {get} /tools/deployment Get  deployment tools
 * @apiVersion 1.0.0
 * @apiName get deployment tools
 * @apiGroup Tools
 *
 * @apiPermission none
 *
 * @apiSuccess {Object[]} tools Returns a list of all deployment tools.
 * @apiSuccessExample {json} Success-Response:
 * [
 {
     "id": "0a75985f-d2da-4c9b-a346-f49697dc1452",
     "name": "Heroku",
     "toolType": "deployment",
     "websiteUrl": "https://www.heroku.com/",
     "apiUrl": "https://api.heroku.com/",
     "documentationUrl": "https://devcenter.heroku.com/",
     "logoSvgUrl": "data:image/svg+xml;utf8,<svg width=\"27\" height=\"30\" viewBox=\"0 0 27 30\" xmlns=\"http://www.w3.org/2000/svg\"><title>heroku-logo</title><path d=\"M3 0C1.13 0 0 1.11 0 2.903v24.194C0 28.883 1.13 30 3 30h21c1.863 0 3-1.11 3-2.903V2.903C26.994 1.11 25.863 0 24 0H3zm21.042 2c.508.006.958.448.958.929V27.07c0 .487-.45.929-.958.929H2.958C2.45 28 2 27.558 2 27.071V2.93c0-.488.45-.93.958-.93h21.084zM20 25h-2.781v-8.506c0-.774-.237-1.048-.468-1.208-1.396-.959-5.414-.042-7.834.916L7 17.012 7.006 5h2.816v7.917a20.99 20.99 0 0 1 1.882-.482c2.988-.643 5.184-.47 6.616.505.787.536 1.68 1.59 1.68 3.554V25zm-6-15h3.293A16.109 16.109 0 0 0 20 5h-3.287c-.49 1.188-1.385 3.188-2.713 5zM7 25v-7l3 3.5L7 25z\" fill=\"%239E7CC1\" fill-rule=\"evenodd\"/></svg>",
     "logoLargeUrl": "https://status.heroku.com/images/favicon-4d37b8350e89706867dad5caab4af5e5.ico",
     "logoSmallUrl": "https://id.heroku.com/assets/logo-vertical.png",
     "usageRequirements": "You must have created a Heroku account before using this tool.",
     "specialConsiderations": null,
     "createdAt": "2018-02-05T21:46:46.000Z",
     "updatedAt": "2018-02-05T21:46:46.000Z"
 }
 ]
 */
router.get('/tools/deployment', toolsController.getDeploymentTools);

/**
 * @api {get} /tools/web Get  web tools
 * @apiVersion 1.0.0
 * @apiName get web tools
 * @apiGroup Tools
 *
 * @apiPermission none
 *
 * @apiSuccess {Object[]} tools Returns a list of all web tools.
 * @apiSuccessExample {json} Success-Response:
 * [
 {
     "id": "c8e0dd2b-bd60-46d7-bd6c-4993a2d7bc76",
     "name": "Express.js",
     "toolType": "web",
     "websiteUrl": "http://expressjs.com/",
     "apiUrl": null,
     "documentationUrl": "http://expressjs.com/en/4x/api.html",
     "logoSvgUrl": null,
     "logoLargeUrl": "https://camo.githubusercontent.com/fc61dcbdb7a6e49d3adecc12194b24ab20dfa25b/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67",
     "logoSmallUrl": null,
     "usageRequirements": null,
     "specialConsiderations": null,
     "createdAt": "2018-02-05T21:46:46.000Z",
     "updatedAt": "2018-02-05T21:46:46.000Z"
 }
 ]
 */
router.get('/tools/web', toolsController.getWebTools);

/**
 * @api {get} /tools/test Get  test tools
 * @apiVersion 1.0.0
 * @apiName get test tools
 * @apiGroup Tools
 *
 * @apiPermission none
 *
 * @apiSuccess {Object[]} tools Returns a list of all test tools.
 * @apiSuccessExample {json} Success-Response:
 * [
 {
     "id": "f922c232-c327-4a64-a68a-d99dbaa2d2cf",
     "name": "Mocha",
     "toolType": "test",
     "websiteUrl": "https://mochajs.org/",
     "apiUrl": null,
     "documentationUrl": "https://mochajs.org/#getting-started",
     "logoSvgUrl": null,
     "logoLargeUrl": "https://cdn.worldvectorlogo.com/logos/mocha-1.svg",
     "logoSmallUrl": null,
     "usageRequirements": null,
     "specialConsiderations": null,
     "createdAt": "2018-02-05T21:46:46.000Z",
     "updatedAt": "2018-02-05T21:46:46.000Z"
 }
 ]
 */
router.get('/tools/test', toolsController.getTestTools);

/**
 * @api {get} /tools/database Get  database tools
 * @apiVersion 1.0.0
 * @apiName get database tools
 * @apiGroup Tools
 *
 * @apiPermission none
 *
 * @apiSuccess {Object[]} tools Returns a list of all test database.
 * @apiSuccessExample {json} Success-Response:
 * [
 {
     "id": "ff9d2ed2-e1d8-4f4e-a316-80f06f49d2a6",
     "name": "Sequelize",
     "toolType": "database",
     "websiteUrl": "http://docs.sequelizejs.com/",
     "apiUrl": null,
     "documentationUrl": "http://docs.sequelizejs.com/",
     "logoSvgUrl": null,
     "logoLargeUrl": null,
     "logoSmallUrl": "http://docs.sequelizejs.com/manual/asset/logo-small.png",
     "usageRequirements": null,
     "specialConsiderations": null,
     "createdAt": "2018-02-05T21:46:46.000Z",
     "updatedAt": "2018-02-05T21:46:46.000Z"
 }
 ]
 */
router.get('/tools/database', toolsController.getDatabaseTools);

export function setDependencies(newToolsService) {
  toolsController.setDependencies(newToolsService);
}
