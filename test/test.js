'use strict';

var assert = require('assert');
var babelDeps = require('../index');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');

module.exports = {
  testCompileDependency: function(test) {
    buildDeps([loadStreamFile('main.js')], null, function(files) {
      assert.strictEqual(3, files.length);
      assert.strictEqual('main.js', files[0].relative);
      assert.strictEqual('foo.js', files[1].relative);
      assert.strictEqual('bar.js', files[2].relative);
      test.done();
    });
  },

  testCompileDependencyWithSourceMaps: function(test) {
    buildDeps([loadStreamFile('main.js')], {babel: {sourceMaps: true}}, function(files) {
      assert.strictEqual(3, files.length);
      assert.ok(files[0].sourceMap);
      assert.ok(files[1].sourceMap);
      assert.ok(files[2].sourceMap);
      test.done();
    });
  },

  testErrorInvalidJs: function(test) {
    buildDeps(
      [loadStreamFile('invalid.js')],
      null,
      function() {},
      function(error) {
        assert.ok(error);
        test.done();
      }
    );
  }
};

function loadStreamFile(filePath) {
  var basePath = path.join(__dirname, 'assets');
  filePath = path.resolve(basePath, filePath);
  return new gutil.File({
    cwd: __dirname,
    base: basePath,
    path: filePath,
    contents: fs.readFileSync(filePath)
  });
}

function buildDeps(sources, options, callback, errorCallback) {
    var stream = babelDeps(options);
    var files = [];
    stream.on('data', function(file) {
      files.push(file);
    });
    stream.on('end', function() {
      callback(files);
    });
    stream.on('error', function(error) {
      errorCallback && errorCallback(error);
    });
    sources.forEach(function(source) {
        stream.write(source);
    });
    stream.end();
}
