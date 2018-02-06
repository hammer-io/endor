import sequelize from '../db/sequelize';

export default class ToolsService {
  /**
   * Tools Service Constrcutor
   * @param toolsRepository the repository to the tools database
   * @param log the logger
   */
  constructor(toolsRepository, log) {
    this.toolsRepository = toolsRepository;
    this.log = log;
  }

  async getToolsByType(toolType) {
    const tools = await this.toolsRepository.findAll({
      where: {
        toolType
      }
    });

    return tools;
  }

  async getTools() {
    const tools = await this.toolsRepository.findAll();
    return tools;
  }

  async getSourceControlTools() {
    return this.getToolsByType(sequelize.ToolType.SOURCE_CONTROL);
  }

  async getCITools() {
    return this.getToolsByType(sequelize.ToolType.CONTINUOUS_INTEGRATION);
  }

  async getContainerizationTools() {
    return this.getToolsByType(sequelize.ToolType.CONTAINERIZATION);
  }

  async getDeploymentTools() {
    return this.getToolsByType(sequelize.ToolType.DEPLOYMENT);
  }

  async getWebFrameworks() {
    return this.getToolsByType(sequelize.ToolType.WEB_FRAMEWORK);
  }

  async getTestFrameworks() {
    return this.getToolsByType(sequelize.ToolType.TEST);
  }

  async getDatabaseTools() {
    return this.getToolsByType(sequelize.ToolType.DATABASE);
  }
}
