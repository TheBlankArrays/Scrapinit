var mocha = require('mocha');
var should = require('chai').should();
var expect = require('chai').expect;
var compare = require('./../imgCompare.js').compare;
 

describe('Image comparison', function() {
  var i = 'a';
   it('should return true', function(done) {
    expect(i).to.equal('a');
    done();
   });

   it('compare should be a function', function (done) {
   compare.should.be.a.Function
    done();
   })

   it('compare should be a function', function (done) {
    var i = '';
   var result = compare(i,i,i);
   expect(result).to.equal(undefined);
    done();
   })

});