const request = require('supertest');
const { app } = require('../lib/handlers');

describe('GET serveStaticPage', function(){
  it('should get the serveStaticPage / path', function(done){
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });
});
