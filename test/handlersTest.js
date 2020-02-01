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

describe('GET nonExisting Url', () => {
  it('should return 404 for a non existing page', (done) => {
    request(app.serve.bind(app))
      .get('/badPage')
      .set('Accept', '*/*')
      .expect(404)
      .expect('Content-Length', '9', done)
      .expect(/Not Found/);  
  });
});

describe('GET Abeliophyllum page', () => {
  it('should return abeliophyllum page', (done) => {
    request(app.serve.bind(app))
      .get('/abeliophyllum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });
});

describe('GET Ageratum page', () => {
  it('should return Ageratum page', (done) => {
    request(app.serve.bind(app))
      .get('/Ageratum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });
});

describe('GET GuestBook page', () => {
  it('should return GuestBook page', (done) => {
    request(app.serve.bind(app))
      .get('/guestBook.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });
});

describe('GET hideCanForSec script', () => {
  it('should return hideCanForSec script', (done) => {
    request(app.serve.bind(app))
      .get('/scripts/hideCanForSec.js')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'application/javascript', done)
      .expect(/hideCanForSec = function()/);
  });
});

describe('GET a css file', () => {
  it('should return style.css script', (done) => {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css', done);
  });
});
