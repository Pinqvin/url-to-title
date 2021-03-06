var assert = require('assert'),
    title = require('../index');
    mock = require('./mock-server')

before(function(done) {
  this.connection = mock.listen(9005, done);
});

after(function(done) {
  this.connection.close(done);
});

function u(path) {
  return 'http://localhost:9005/' + path;
}
describe('Title scraper', function() {

  it('should return promise when called without callback', function() {
    assert.ok(title(u('default')).then);
  });

  it('should support node-callback style', function(done) {
    title(u('default'), done);
  });

  it('should return the title of the given url', function(done) {
    title(u('default'))
    .then(function(title) {
      assert.equal(title, 'default');
      done();
    })
    .catch(done);
  });

  it('should return multiple titles if the first arguments in an array', function(done) {
    title([u('default'), u('foo')])
    .then(function(results) {
      assert.equal(results[0], 'default');
      assert.equal(results[1], 'foo');
      done();
    });
  });

  it('should convert ISO-8859-1 encoding', function(done) {
    title(u('ISO-8859-1'))
    .then(function(title) {
      assert.equal(title, 'Jyrkkä lasku tyytyväisyydessä! Suomalaiset nyreissään pankeille | Kotimaan uutiset | Iltalehti.fi');
      done();
    });
  });

  it('should convert UTF-8 encoding', function(done) {
    title(u('UTF-8'))
    .then(function(title) {
      assert.equal(title, 'Huolimattomalle tankkaajalle voi räpsähtää tuhansien eurojen lasku | Yle Uutiset | yle.fi');
      done();
    });
  });

  it('should reject request if url points to an image', function(done) {
    title(u('image'))
    .then(function() {
      done(new Error('resolved to image'));
    })
    .catch(done.bind(null, null));
  });

  it('should make requests with an user agent header set', function(done) {
    title(u('user-agent'))
    .then(function(title) {
      assert.equal(title, 'bar');
      done();
    });
  });
});
