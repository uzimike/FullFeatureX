var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Logging In', function() {
  it('should log Borat into the app with the correct password', function(done) {
    chai.request(server)
      .post('/users/login')
      .send({
        'username': 'Borat',
        'password': 'borat'
      })
      .end(function(err, res) {
        res.status.should.equal(200);
        res.redirects.length.should.equal(2);
        done();
      });
  });
  it('should not log Borat into the app with the wrong password', function(done) {
    chai.request(server)
      .post('/users/login')
      .send({
        'username': 'Borat',
        'password': 'notborat'
      })
      .end(function(err, res) {
        res.status.should.equal(200);
        res.redirects.length.should.equal(1);
        done();
      });
  });
});
