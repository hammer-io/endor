import { expect } from 'chai';
import { defineTables, populateTools } from '../../src/db/init_database';
import { getMockLogger } from '../util/mockLogger';
import sequelize from '../../src/db/sequelize';
import ToolsService from '../../src/services/tools.service';
import '../globalSetupTeardown.test';

const toolsService = new ToolsService(sequelize.Tool, getMockLogger());

describe('Test Tools Service ', () => {
  before(async () => {
    await defineTables();
    await populateTools();
  });


  describe('Continuous Integration Tests', async () => {
    it('should get the continuous integration tools', async () => {
      const tools = await toolsService.getCITools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('TravisCI');
    });

    it('should get the continuous integration tools', async () => {
      const tools = await toolsService.getCITools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('TravisCI');

      const toolName = tools[0].name;
      const foundToolName = await toolsService.ciToolName(tools[0].id);
      expect(foundToolName).to.equal(toolName);
    });

    it('should get the continuous integration tools', async () => {
      const tools = await toolsService.getCITools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('TravisCI');

      const wrongId = 'thisisanincorrectid';
      const foundToolName = await toolsService.ciToolName(wrongId);
      expect(foundToolName).to.be.an('undefined');
    });
  });

  describe('Containerization Tools', async () => {
    it('should get the containerization tools', async () => {
      const tools = await toolsService.getContainerizationTools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Docker');
    });

    it('should get the containerization tools', async () => {
      const tools = await toolsService.getContainerizationTools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Docker');

      const toolName = tools[0].name;
      const foundToolName = await toolsService.containerizationToolName(tools[0].id);
      expect(foundToolName).to.equal(toolName);
    });

    it('should get the containerization tools', async () => {
      const tools = await toolsService.getContainerizationTools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Docker');

      const wrongId = 'wrongId';
      const foundToolName = await toolsService.containerizationToolName(wrongId);
      expect(foundToolName).to.be.an('undefined');
    });
  });

  describe('Deployment Tools', async () => {
    it('should get the deployment tools', async () => {
      const tools = await toolsService.getDeploymentTools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Heroku');
    });

    it('should get the deployment tools', async () => {
      const tools = await toolsService.getDeploymentTools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Heroku');

      const toolName = tools[0].name;
      const foundToolName = await toolsService.deploymentToolName(tools[0].id);
      expect(foundToolName).to.equal(toolName);
    });

    it('should get the deployment tools', async () => {
      const tools = await toolsService.getDeploymentTools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Heroku');

      const wrongId = 'wrongId';
      const foundToolName = await toolsService.deploymentToolName(wrongId);
      expect(foundToolName).to.be.an('undefined');
    });
  });

  describe('Web Frameworks', async () => {
    it('should get the web framework tools', async () => {
      const tools = await toolsService.getWebFrameworks();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('ExpressJS');
    });

    it('should get the web framework tools', async () => {
      const tools = await toolsService.getWebFrameworks();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('ExpressJS');

      const toolName = tools[0].name;
      const foundToolName = await toolsService.webFrameworksName(tools[0].id);
      expect(foundToolName).to.equal(toolName);
    });

    it('should get the web framework tools', async () => {
      const tools = await toolsService.getWebFrameworks();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('ExpressJS');

      const wrongId = 'wrongId';
      const foundToolName = await toolsService.webFrameworksName(wrongId);
      expect(foundToolName).to.be.an('undefined');
    });
  });
  describe('Testing Frameworks', async () => {
    it('should get the testing framework tools', async () => {
      const tools = await toolsService.getTestFrameworks();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Mocha');
    });

    it('should get the testing framework tools', async () => {
      const tools = await toolsService.getTestFrameworks();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Mocha');

      const toolName = tools[0].name;
      const foundToolName = await toolsService.testFrameworksName(tools[0].id);
      expect(foundToolName).to.equal(toolName);
    });

    it('should get the testing framework tools', async () => {
      const tools = await toolsService.getTestFrameworks();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Mocha');

      const wrongId = 'wrongId';
      const foundToolName = await toolsService.testFrameworksName(wrongId);
      expect(foundToolName).to.be.an('undefined');
    });
  });

  describe('Database Tools', async () => {
    it('should get the database tools', async () => {
      const tools = await toolsService.getOrmTools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Sequelize');
    });

    it('should get the database tools', async () => {
      const tools = await toolsService.getOrmTools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Sequelize');

      const toolName = tools[0].name;
      const foundToolName = await toolsService.ormToolName(tools[0].id);
      expect(foundToolName).to.equal(toolName);
    });

    it('should get the database tools', async () => {
      const tools = await toolsService.getOrmTools();
      expect(tools.length).to.equal(1);
      expect(tools[0].name).to.equal('Sequelize');

      const wrongId = 'wrongId';
      const foundToolName = await toolsService.ormToolName(wrongId);
      expect(foundToolName).to.be.an('undefined');
    });
  });
});
