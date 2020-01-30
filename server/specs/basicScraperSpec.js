var mocha = require('mocha');
var expect = require('expect.js');
var basicScraper = require('../controllers/basicScraperController');
describe('Basic Scraper', function() {

  var url;
  it('should successefully return an html string, with valid url', function(done) {
    url = 'http://www.google.com';
    basicScraper.getScreenshot(url, 1000000, function(path, email){
      expect(path).to.be('assets/1000000/www_google_com-preview.png');
      expect(email).to.be('test@test.com');
      done();
    }, 'test@test.com');
  });

  it('should not return an html string, with invalid url', function(done) {
    url = 'asdfadsfgoogle.com';
    basicScraper.getScreenshot(url, 10000000, function(path, email){
      expect(path).to.be(403);
      expect(email).to.be(undefined);
      done();
    });
  });
});



