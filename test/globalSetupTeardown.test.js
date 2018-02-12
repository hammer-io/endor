import sequelize from '../src/db/sequelize';
import { getActiveLogger } from '../src/utils/winston';
import { defineTables, populateTools } from '../src/db/init_database';

sequelize.initSequelize();

before(async () => {
  console.log('Beginning Endor Test Suite');
  getActiveLogger().info('---------------------------------------------------------------');
  getActiveLogger().info('-------------------  BEGINNING TEST SUITE  --------------------');
  getActiveLogger().info('---------------------------------------------------------------');
  await defineTables();
  await populateTools();
});

after(() => {
  getActiveLogger().info('---------------------------------------------------------------');
  getActiveLogger().info('-------------------  TEST SUITE COMPLETE  ---------------------');
  getActiveLogger().info('---------------------------------------------------------------');
  console.log('Endor Test Suite Complete!');
  // Do any cleanup if necessary
});

let testIndex = 0;

beforeEach(() => {
  getActiveLogger().info(`::::::: TEST ${testIndex++}`);
});
