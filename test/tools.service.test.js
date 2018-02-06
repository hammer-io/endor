import { expect } from 'chai';

import { defineTables, populateTools } from '../src/db/init_database';
import { getMockLogger } from './mockLogger';
const sequelize = require('../src/db/sequelize');
import ToolsService from '../dist/services/tools.service';

sequelize.initSequelize();

const toolsService = new ToolsService(sequelize.Tool, getMockLogger());

describe('Test Tools Service ', () => {
  beforeEach(async () => {
    await defineTables();
    await populateTools();
  });

  it('should get the source control tools', async () => {
    const tools = await toolsService.getSourceControlTools();
    expect(tools.length).to.equal(1);
    expect(tools[0].name).to.equal('GitHub');
  });
  it('should get the continuous integration tools', async () => {
    const tools = await toolsService.getCITools();
    expect(tools.length).to.equal(1);
    expect(tools[0].name).to.equal('TravisCI');
  });
  it('should get the containerization tools', async () => {
    const tools = await toolsService.getContainerizationTools();
    expect(tools.length).to.equal(1);
    expect(tools[0].name).to.equal('Docker');
  });
  it('should get the deployment tools', async () => {
    const tools = await toolsService.getDeploymentTools();
    expect(tools.length).to.equal(1);
    expect(tools[0].name).to.equal('Heroku');
  });
  it('should get the web framework tools', async () => {
    const tools = await toolsService.getWebFrameworks();
    expect(tools.length).to.equal(1);
    expect(tools[0].name).to.equal('ExpressJS');
  });
  it('should get the testing framework tools', async () => {
    const tools = await toolsService.getTestFrameworks();
    expect(tools.length).to.equal(1);
    expect(tools[0].name).to.equal('Mocha');
  });
  it('should get the database tools', async () => {
    const tools = await toolsService.getDatabaseTools();
    expect(tools.length).to.equal(1);
    expect(tools[0].name).to.equal('Sequelize');
  });
});
