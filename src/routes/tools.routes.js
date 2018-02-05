/* eslint-disable import/prefer-default-export */
import express from 'express';
import * as toolsController from '../controllers/tools.controller';

export const router = express.Router();

router.get('/tools', toolsController.getTools);

router.get('/tools/sourcecontrol', toolsController.getSourceControlTools);

router.get('/tools/ci', toolsController.getCITools);

router.get('/tools/containerization', toolsController.getContainerizationTools);

router.get('/tools/deployment', toolsController.getDeploymentTools);

router.get('/tools/web', toolsController.getWebTools);

router.get('/tools/test', toolsController.getTestTools);

router.get('/tools/database', toolsController.getDatabaseTools);

export function setDependencies(newToolsService) {
  toolsController.setDependencies(newToolsService);
}
