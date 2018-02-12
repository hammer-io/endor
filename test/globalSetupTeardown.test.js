import sequelize from '../src/db/sequelize';
import { defineTables, populateTools } from '../src/db/init_database';

sequelize.initSequelize();

before(async () => {
  console.log('Beginning Endor Test Suite');
  await defineTables();
  await populateTools();
});

after(() => {
  console.log('Endor Test Suite Complete!');
  // Do any cleanup if necessary
});
