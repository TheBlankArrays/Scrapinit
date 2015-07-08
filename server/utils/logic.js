
// TODO: Handle "change"
module.exports = {
  greater: function(text, UserUrl, cb) {
    console.log('TESTING greater')
    // pulls first set of numbers from text
    var compareVal = text.match(/\d+\.?\d*/gi)[0];
    console.log('compareVal is', compareVal);
    if (compareVal < UserUrl.compareVal) {
      cb();
    }
  },
  less: function(text, UserUrl, cb) {
    console.log('TESTING less')
    // pulls first set of numbers from text
    var compareVal = text.match(/\d+\.?\d*/gi)[0];
    console.log('the compareVal is ', compareVal);
    // TESTING
    cb();

    // ACTUAL
    // if (compareVal > UserUrl.compareVal) {
    //   cb();
    // }
  },
  contains: function(text, UserUrl, cb) {
    console.log('TESTING contains')
    // if a user wants to check for multiple words
    var contains = UserUrl.compareVal.split(',') || UserUrl.compareVal;
    // iterate through each word
    for (var i = 0; i < contains.length; i++) {
      // if text contains any of the values
      if (text.indexOf(contains[i])) {
        cb();
      } // if (text.indexOf(contains[i])) {
    } // for (var i = 0; i < contains.length; i++) {
  },
  changes: function(text, UserUrl, cb) {
    console.log('TESTING lastResort')
    if (UserUrl.cronVal !== text) {
     cb();
    } // if (UserUrl.cronVal !== text) {
  },
  lastResort: function(text, UserUrl, cb) {
    console.log('TESTING lastResort')
    if (UserUrl.cronVal !== text) {
     cb();
    } // if (UserUrl.cronVal !== text) {
  }
}