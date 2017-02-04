var fs = require('fs');
var vm = require('vm');
var path = require('path');

var load = function(js) {
    var filePath = path.join(__dirname, js);
    vm.runInThisContext(fs.readFileSync(filePath), js);
}.bind(this);

load('json-filter.js');

module.exports = JSON.filter;
