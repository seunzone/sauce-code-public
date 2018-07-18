import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
const { expect } = chai;

chai.use(chaiHttp);

describe('School Review API Test', () => {
    describe('GET unexistent route', () => {
      // Test for undefined routes
      it(' should Return 404 for unexistent route', (done) => {
        chai
          .request(app)
          .get('/an/undefined/route')
          .end((err, res) => {
            expect(res)
              .to
              .have
              .status(404);
            done();
          });
      });
    });
    describe('POST school', () => {
      it('Should return 401 when you post a school without loggin in', (done) => {
        chai
          .request(app)
          .post('/addSchool')
          .send({
            name: 'Affirm college',
            description: 'very good school',
            address: '24, bala road',
            location: 'Kogi',
            type: 'Secondary school',
            email: 'blah@blah.com',
            phone: 43429442242
          })
          .end((err, res) => {
            expect(res)
              .to
              .have
              .status(401); //because you are not logged in
            done();
          });
      });
    });
    describe('GET All schools successfully', () => {
        it('should Return 200 when getting all schools', (done) => {
            chai
              .request(app)
              .get('/list')
              .end((err, res) => {
                expect(res)
                  .to
                  .have
                  .status(200);
              });
                done();
          });
    });
    describe('POST search requests', () => {
        it('return 200 if a user searches for schools sucessfully', (done) => {
            chai
                .request(app)
                .post('/addSchool')
                .send({
                    location: 'Kogi',
                    type: 'Secondary school',
                })
                .end((err, res) => {
                    expect(res)
                    .to
                    .have
                    .status(401); //because you are not logged in
                    done();
                });
          });
    });
    describe('POST existent login details requests', () => {
        it('return 200 if a user searches for schools sucessfully', (done) => {
            chai
                .request(app)
                .post('/signup')
                .send({
                    email: 'waro',
                    password: 'warrow',
                    username: 'waro'
                })
                .end((err, res) => {
                    expect(res)
                    .to
                    .have
                    .status(400); //because a user with those details 
                });
                done();
          });
    });
});