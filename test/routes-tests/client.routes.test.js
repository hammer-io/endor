import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import * as apiUtil from '../util/api.util';
import { populateAllTestData } from '../../src/db/import_test_data';
import '../globalSetupTeardown.test';

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

describe('Testing Client Routes', () => {
  beforeEach(async () => {
    await populateAllTestData(true);
  });

  describe('POST /clients', () => {
    it('should return the newly created client for the user', (done) => {
      const client = {
        "name": "endor_frontend",
        "clientId": "unique_client_id",
        "secret": "client_secret"
      };
      chai.request(server)
        .post(`${apiUtil.API}/clients`)
        .set('Authorization',apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send({ client })
        .end((err, res) => {
          res.should.have.status(200);
          expect(err).to.be.a('null');
          expect(res.body).be.an('object');
          expect(res.body.name).to.equal(client.name);
          expect(res.body.clientId).to.equal(client.clientId);
          expect(res.body.secret).to.equal(client.secret);
          done();
        })
    });
  });
});