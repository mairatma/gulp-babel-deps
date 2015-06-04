'use strict';

var assert = require('assert');

module.exports = {
  testSomething: function(test) {
    assert.fail();
    test.done();
  }
};
