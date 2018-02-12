let chai = require('chai');
let chaiHttp = require('chai-http');

import server from '../../src/index';
import sequelize from '../../src/db/sequelize';
import * as apiUtil from '../util/api.util';
import { defineTables, populateTools } from '../../src/db/init_database';
import {
  populateClients,
  populateUsers,
  populateAccessCodes,
  populateTokens,
} from '../../src/db/import_test_data';

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

sequelize.initSequelize();

describe('Tools Route Test', () => {
  beforeEach(async () => {
    await defineTables();
    await populateUsers();
    await populateClients();
    await populateAccessCodes();
    await populateTokens();
    await populateTools();
  });
  describe('GET /tools', async () => {
    it('should get all tools', (done) => {
      chai.request(server)
        .get(`${apiUtil.API}/tools`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.length).to.equal(7);
          done();
        });
    });
  });

  describe('GET /tools/sourcecontrol', async (done) => {
    it('should get source control tools', (done) => {
      chai.request(server)
        .get(`${apiUtil.API}/tools/sourcecontrol`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.length).to.equal(1);
          done();
        });
    });
  });
  describe('GET /tools/ci', async () => {
    it('should get ci tools', (done) => {
      chai.request(server)
        .get(`${apiUtil.API}/tools/ci`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.length).to.equal(1);
          done();
        });
    });
  });
  describe('GET /tools/containerization', async () => {
    it('should get get containerization tools', (done) => {
      chai.request(server)
        .get(`${apiUtil.API}/tools/containerization`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.length).to.equal(1);
          done();
        });
    });
  });
  describe('GET /tools/deployment', async () => {
    it('should get deployment tools', (done) => {
      chai.request(server)
        .get(`${apiUtil.API}/tools/deployment`)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.length).to.equal(1);
          done();
        });
    });
    describe('GET /tools/web', async () => {
      it('should get web framework tools', (done) => {
        chai.request(server)
          .get(`${apiUtil.API}/tools/web`)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.length).to.equal(1);
            done();
          });
      });
    });
    describe('GET /tools/test', async () => {
      it('should get test framework tools', (done) => {
        chai.request(server)
          .get(`${apiUtil.API}/tools/test`)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.length).to.equal(1);
            done();
          });
      });
    });
    describe('GET /tools/database', async () => {
      it('should get database tools', (done) => {
        chai.request(server)
          .get(`${apiUtil.API}/tools/database`)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.length).to.equal(1);
            done();
          });
      });
    });
  });
});