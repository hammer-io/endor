import chai from 'chai';
import chaiHttp from 'chai-http';
import { populateAllTestData } from '../../src/db/import_test_data';
import * as apiUtil from '../util/api.util';
import server from '../../src';
import '../globalSetupTeardown.test';

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;


describe('Testing Contributor Routes', () => {
  beforeEach(async () => {
    await populateAllTestData(true);
  });

  describe('POST /projects/:projectId/contributors/:user', () => {
    it('should return the project with the newly added user among the contributors', (done) => {
      chai.request(server)
        .post(`${apiUtil.API}/projects/b3/contributors/a2`)
        .set('Authorization', apiUtil.basicAuthorization('johnnyb', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(201);
          const projectContributors = res.body;
          expect(projectContributors.filter(contributor => contributor.id === 'a2').length).to.equal(1);
          done();
        });
    });

    it('should have a status of 422 if the user being added is already a contributor or owner', (done) => {
      chai.request(server)
        .post(`${apiUtil.API}/projects/b1/contributors/a2`)
        .set('Authorization', apiUtil.basicAuthorization('johnnyb', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });

    it('should not return the project if the authenticated user is not among the project owners', (done) => {
      chai.request(server)
        .post(`${apiUtil.API}/projects/b2/contributors/a5`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should return a status 401 if there is no authorization header', (done) => {
      chai.request(server)
        .post(`${apiUtil.API}/projects/b2/contributors/a5`)
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('DELETE /projects/:projectId/contributors/:user', () => {
    it('should return a status of 200', (done) => {
      chai.request(server)
        .delete(`${apiUtil.API}/projects/b2/contributors/a3`)
        .set('Authorization', apiUtil.basicAuthorization('johnnyb', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should return a status of 401 if the user is not an owner', (done) => {
      chai.request(server)
        .delete(`${apiUtil.API}/projects/b2/contributors/a3`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should return a status 401 if there is no authorization header', (done) => {
      chai.request(server)
        .post(`${apiUtil.API}/projects/b2/contributors/a3`)
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
