module.exports = {
  greater: function(text, UserUrl) {
    // pulls first set of numbers from text
    var compareVal = text.match(/\d+\.?\d*/gi)[0];
    console.log('compareVal is', compareVal);
    if (compareVal < UserUrl.compareVal) {
      cb(oldImg, newImg);
    }
  },
  less: function(text, UserUrl) {
    // pulls first set of numbers from text
    var compareVal = text.match(/\d+\.?\d*/gi)[0];
    console.log('the compareVal is ', compareVal);
    if (compareVal > UserUrl.compareVal) {
      cb(oldImg, newImg);
    }
  },
  contains: function(text, UserUrl) {
    // if a user wants to check for multiple words
    var contains = UserUrl.compareVal.split(',') || UserUrl.compareVal;
    // iterate through each word
    for (var i = 0; i < contains.length; i++) {
      // if text contains any of the values
      if (text.indexOf(contains[i])) {
        cb(oldImg, newImg);
      } // if (text.indexOf(contains[i])) {
    } // for (var i = 0; i < contains.length; i++) {
  },
  lastResort: function(text, UserUrl) {
    if (UserUrl.cronVal !== text) {
     cb(oldImg, newImg);
    } // if (UserUrl.cronVal !== text) {
  }
}