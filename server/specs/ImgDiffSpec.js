var mocha = require('mocha');
var expect = require('expect.js');
var compare = require('./../imgCompare.js').compare;


describe('Image comparison', function() {
  var i = 'a';
   it('should return true', function(done) {
    expect(i).to.equal('a');
    done();
   });


  it('compare should be a function', function (done) {

    expect(compare).to.be.an('function');
    done();
  })

  it('should return undefined when no images are passes', function (done) {
    var i = '';
    var result = compare(i,i,i);
    expect(result).to.equal(undefined);
    done();
  })

});