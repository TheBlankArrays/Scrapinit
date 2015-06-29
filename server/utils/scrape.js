var phantom = require('phantom');
var utils = {
  scrapeFullImage: function (url, file, folder, callback) {
    phantom.create(function (ph) {
      ph.createPage(function (page) {
        page.open(url, function (status) {
          var directory = __dirname + '/../../client/'
          var path = 'assets/' + folder + '/' + file;
          page.render(directory + path, function (res) {
            callback(status, path);
            ph.exit();
          });
        });
      });
    });
  }
};

module.exports = utils;