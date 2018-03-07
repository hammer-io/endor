import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/index';
import * as apiUtil from '../util/api.util';
import { populateAllTestData } from '../../src/db/import_test_data';
import '../globalSetupTeardown.test';

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

describe('Testing User Routes', () => {
  before(async () => {
    await populateAllTestData(true);
  });

  describe('GET /users', () => {
    it('should return all users', (done) => {
      chai.request(server)
        .get(`${apiUtil.API}/users`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.length).to.equal(5);
          done();
        })
    });
  });

  describe('GET /users/:user', () => {
    it('should return the specified user\'s information', (done) => {
      chai.request(server)
        .get(`${apiUtil.API}/users/jreach`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          const user = res.body;
          expect(user.username).to.equal('jreach');
          expect(user.id).to.equal('a3');
          done();
        });
    });

    it('should return the specified user\'s information', (done) => {
      chai.request(server)
        .get(`${apiUtil.API}/users/a3`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          const user = res.body;
          expect(user.username).to.equal('jreach');
          expect(user.id).to.equal('a3');
          done();
        });
    });

    it('should not return the specified user if the authentication is incorrect', (done) => {
      chai.request(server)
        .get(`${apiUtil.API}/users/a3`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext'))
        .send()
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });

  describe('PATCH /users/:user', () => {
    beforeEach(async () => {
      await populateAllTestData(true);
    });

    it('should update the specified user', (done) => {
      const body = {
        lastName: 'Dorsey'
      };
      chai.request(server)
        .patch(`${apiUtil.API}/users/a3`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          const user = res.body;
          expect(user.username).to.equal('jreach');
          expect(user.id).to.equal('a3');
          expect(user.firstName).to.equal('Jack');
          expect(user.lastName).to.equal('Dorsey');
          expect(user.email).to.equal('hammer.io.team@gmail.com');
          done();
        });
    });

    it('should not update the specified user if the authorization does not match', (done) => {
      const body = {
        lastName: 'Dorsey'
      };
      chai.request(server)
        .patch(`${apiUtil.API}/users/a2`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send(body)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('DELETE /users/:user', () => {
    beforeEach(async () => {
      await populateAllTestData(true);
    });

    it('should update the specified user', (done) => {
      chai.request(server)
        .delete(`${apiUtil.API}/users/a3`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });

    it('should not update the specified user if the authorization does not match', (done) => {
      chai.request(server)
        .delete(`${apiUtil.API}/users/a2`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
