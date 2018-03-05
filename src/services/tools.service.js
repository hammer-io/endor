/* eslint-disable class-methods-use-this */
import sequelize from '../db/sequelize';

let self;

export default class ToolsService {
  /**
   * Tools Service Constrcutor
   * @param toolsRepository the repository to the tools database
   * @param log the logger
   */
  constructor(toolsRepository, log) {
    this.toolsRepository = toolsRepository;
    this.log = log;
    self = this;
  }

  /**
   * Retrieves all tools of the specified type.
   *
   * @param toolType - the type of tools to return
   * @returns {Promise<Array<Model>>}
   */
  async getToolsByType(toolType) {
    const tools = await self.toolsRepository.findAll({
      where: {
        toolType
      }
    });

    return tools;
  }

  /**
   * Finds all the tools in the database.
   *
   * @returns {Promise<Array<Model>>}
   */
  async getTools() {
    const tools = await self.toolsRepository.findAll();
    return tools;
  }

  /**
   * Finds all source control tools.
   *
   * @returns {Promise<Array<Model>>}
   */
  async getSourceControlTools() {
    return self.getToolsByType(sequelize.ToolType.SOURCE_CONTROL);
  }

  /**
   * Finds all continuous integration tools.
   *
   * @returns {Promise<Array<Model>>}
   */
  async getCITools() {
    return self.getToolsByType(sequelize.ToolType.CONTINUOUS_INTEGRATION);
  }

  /**
   * Finds all containerization tools.
   *
   * @returns {Promise<Array<Model>>}
   */
  async getContainerizationTools() {
    return self.getToolsByType(sequelize.ToolType.CONTAINERIZATION);
  }

  /**
   * Finds all deployment tools.
   *
   * @returns {Promise<Array<Model>>}
   */
  async getDeploymentTools() {
    return self.getToolsByType(sequelize.ToolType.DEPLOYMENT);
  }

  /**
   * Finds all web frameworks.
   *
   * @returns {Promise<Array<Model>>}
   */
  async getWebFrameworks() {
    return self.getToolsByType(sequelize.ToolType.WEB_FRAMEWORK);
  }

  /**
   * Finds all test frameworks.
   *
   * @returns {Promise<Array<Model>>}
   */
  async getTestFrameworks() {
    return self.getToolsByType(sequelize.ToolType.TEST);
  }

  /**
   * Finds all database tools.
   *
   * @returns {Promise<Array<Model>>}
   */
  async getDatabaseTools() {
    return self.getToolsByType(sequelize.ToolType.DATABASE);
  }

  /**
   * Find the name of the source control tool matching the given id. If the tool does not exist
   * in the database, it will return undefined.
   *
   * @param sourceControlToolId - the id of the source control tool
   * @returns {Promise<undefined>}
   */
  async sourceControlToolName(sourceControlToolId) {
    const scToolsAvailable = await self.getToolsByType(sequelize.ToolType.SOURCE_CONTROL);
    const potentialMatch = scToolsAvailable.filter(scTool => scTool.id === sourceControlToolId);
    if (potentialMatch[0]) {
      return potentialMatch[0].name;
    }
    return undefined;
  }

  /**
   * Find the name of the continuous integration tool. If the tool does not exist in the database,
   * it will return undefined.
   *
   * @param ciToolId - the id of the continuous integration tool
   * @returns {Promise<undefined>}
   */
  async ciToolName(ciToolId) {
    const ciToolsAvailable = await self.getToolsByType(sequelize.ToolType.CONTINUOUS_INTEGRATION);
    const potentialMatch = ciToolsAvailable.filter(ciTool => ciTool.id === ciToolId);
    if (potentialMatch[0]) {
      return potentialMatch[0].name;
    }
    return undefined;
  }

  /**
   * Find the name of the containerization tool. If the tool does not exist in the database, it
   * will return undefined.
   *
   * @param cToolId - the id of the containerization tool
   * @returns {Promise<undefined>}
   */
  async containerizationToolName(cToolId) {
    const containerizationToolsAvailable =
      await self.getToolsByType(sequelize.ToolType.CONTAINERIZATION);
    const potentialMatch = containerizationToolsAvailable.filter(cTool => cTool.id === cToolId);
    if (potentialMatch[0]) {
      return potentialMatch[0].name;
    }
    return undefined;
  }

  /**
   * Find the name of the deployment tool. If the tool does not exist in the database, it
   * will return undefined.
   *
   * @param dToolId - the id of the deployment tool
   * @returns {Promise<undefined>}
   */
  async deploymentToolName(dToolId) {
    const deploymentToolsAvailable = await self.getToolsByType(sequelize.ToolType.DEPLOYMENT);
    const potentialMatch = deploymentToolsAvailable.filter(dTool => dTool.id === dToolId);
    if (potentialMatch[0]) {
      return potentialMatch[0].name;
    }
    return undefined;
  }

  /**
   * Find the name of the web framework. If the web framework does not exist in the database, it
   * will return undefined.
   *
   * @param webFrameworkId - the id of the web framework
   * @returns {Promise<undefined>}
   */
  async webFrameworksName(webFrameworkId) {
    const webFrameworksAvailable = await self.getToolsByType(sequelize.ToolType.WEB_FRAMEWORK);
    const potentialMatch = webFrameworksAvailable.filter(wf => wf.id === webFrameworkId);
    if (potentialMatch[0]) {
      return potentialMatch[0].name;
    }
    return undefined;
  }

  /**
   * Finds the name of the test framework. If the test framework id does not exist in the database,
   * it will return undefined.
   *
   * @param testFrameworkId - the id of the test framework
   * @returns {Promise<undefined>}
   */
  async testFrameworksName(testFrameworkId) {
    const testFrameworksAvailable = await self.getToolsByType(sequelize.ToolType.TEST);
    const potentialMatch = testFrameworksAvailable.filter(tf => tf.id === testFrameworkId);
    if (potentialMatch[0]) {
      return potentialMatch[0].name;
    }
    return undefined;
  }

  /**
   * Finds the name of the database tool.  If the id does not exist in the database, it will
   * return undefined.
   *
   * @param dbToolId - the id of the database tool
   * @returns {Promise<undefined>}
   */
  async databaseToolName(dbToolId) {
    const webFrameworksAvailable = await self.getToolsByType(sequelize.ToolType.DATABASE);
    const potentialMatch = webFrameworksAvailable.filter(dbTool => dbTool.id === dbToolId);
    if (potentialMatch[0]) {
      return potentialMatch[0].name;
    }
    return undefined;
  }
}
