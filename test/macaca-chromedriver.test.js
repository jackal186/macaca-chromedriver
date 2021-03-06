'use strict';

var assert = require('assert');
var detectPort = require('detect-port');

var ChromeDriver = require('..');
const _ = require('../lib/helper');

describe('test', function() {
  this.timeout(5 * 60 * 1000);
  const proxyPort = detectPort(9515);
  const chromedriver = new ChromeDriver({
    proxyPort: proxyPort
  });

  before(function * () {
    chromedriver.start({
      browserName: 'chrome'
    });
    // browser needs some time to start up
    yield _.sleep(4000);
  });

  it('should be ok', function () {
    assert.ok(chromedriver);
  });

  it('get status', async function () {
    const status = await chromedriver.getStatus();
    assert.equal(status.status, 0);
  });

  after(async function () {
    chromedriver.stop();
    let cmd = '';
    if (_.platform.isOSX) {
      cmd = 'ps -ef | grep -i Chrome | grep -v grep  | grep -e \'remote-debugging-port\' | awk \'{ print $2 }\' | xargs kill -15';
    } else if (_.platform.isLinux) {
      cmd = 'ps -ef | grep -i Chrome | grep -v grep  | grep -e \'remote-debugging-port\' | awk \'{ print $2 }\' | xargs -r kill -15';
    }
    _.exec(cmd);
  });

});
