import chai from 'chai';
import chaiHttp from 'chai-http';
import { populateAllTestData } from '../../src/db/import_test_data';
import * as apiUtil from '../util/api.util';
import server from '../../src';
import '../globalSetupTeardown.test';
import fs from 'fs-extra';

chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

describe('Testing Project Routes', () => {
  beforeEach(async () => {
    await populateAllTestData(true);
  });

  describe('PATCH /projects/:projectId', () => {
    it('should update the specified project', (done) => {
      const body = {
        version: '5.0.6'
      };

      chai.request(server)
        .patch(`${apiUtil.API}/projects/b2`)
        .set('Authorization', apiUtil.basicAuthorization('johnnyb', 'plaintext1'))
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          const project = res.body;
          expect(project.projectName).to.equal('hammer-io');
          expect(project.description).to.equal('Hit it with a hammer!');
          expect(project.version).to.equal('5.0.6');
          expect(project.license).to.equal('MIT');
          expect(project.authors).to.equal('Jack');
          done();
        });
    });

    it('should not update the specified project if the authenticated user is not an owner', (done) => {
      const body = {
        version: '5.0.6'
      };

      chai.request(server)
        .patch(`${apiUtil.API}/projects/b2`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send(body)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not update the specified project if there is not an authenticated user', (done) => {
      const body = {
        version: '5.0.6'
      };

      chai.request(server)
        .patch(`${apiUtil.API}/projects/b2`)
        .send(body)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('POST /user/projects', () => {
    it('should create a new project for the authenticated user', (done) => {
      const body = {
          projectName: 'Rock Opera',
          description: 'A new Rock Opera',
          version: '0.0.0',
          license: 'MIT',
          author: 'None'
      };
      chai.request(server)
        .post(`${apiUtil.API}/user/projects`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          fs.remove(`${process.cwd()}/generated-projects/a3/`)
            .then(() => { done() })
            .catch((err) => {
              expect(err).to.be.an('undefined');
              done();
            });
        })
    });
  });

  describe('DELETE /projects/:projectId', () => {
    it('should delete a project and return 204 if the user has owner level permissions', (done) => {
      chai.request(server)
        .delete(`${apiUtil.API}/projects/b2`)
        .set('Authorization', apiUtil.basicAuthorization('johnnyb', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });

    it('should not delete a project and return 204 if the user does not have owner level permissions', (done) => {
      chai.request(server)
        .delete(`${apiUtil.API}/projects/b2`)
        .set('Authorization', apiUtil.basicAuthorization('jreach', 'plaintext1'))
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not delete a project and return 403 if the user is not authenticated', (done) => {
      chai.request(server)
        .delete(`${apiUtil.API}/projects/b2`)
        .send()
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});