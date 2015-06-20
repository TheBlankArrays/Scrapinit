var mocha = require('mocha');
var should = require('chai').should();
var expect = require('chai').expect;
var basicScraper = require('../controllers/basicScraperController');

describe('Basic Scraper', function() {
  var url;
  it('should successefully return an html string, with valid url', function(done) {
    url = 'http://www.google.com';
    basicScraper.get(url, function(error, response, html){
      error = !!error;
      html = !!html;
      expect(error).to.equal(false);  
      expect(html).to.equal(true);      
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should not return an html string, with invalid url', function(done) {
    url = 'www.google.com';
    basicScraper.get(url, function(error, response, html){
      error = !!error;
      expect(error).to.equal(true);
      expect(html).to.equal(null);              
      expect(response.statusCode).to.equal(null);
      done();
    });
  });
});



