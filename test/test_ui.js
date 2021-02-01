const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const mocha = require('mocha');

require('./fixtures/fixtures.js');


describe('Test UI', function() {
  before(async function() {
    timeout = 5000;
    driver = await browsers.firefox();
  });
  
  after(async function() {
    driver.quit();
  });
  
  beforeEach(async function() {
    let localIndex = __dirname.slice(0, __dirname.lastIndexOf('/')) + '/index.html';
    await driver.get(`file:///${localIndex}`);
    await driver.executeScript(`localStorage.setItem('username', '${testCreds.username}');`);
    await driver.executeScript(`localStorage.setItem('${testCreds.username}', '${JSON.stringify(fixtures.encDBPopulated)}');`);
    await driver.executeScript(`localStorage.setItem('db', '${JSON.stringify(fixtures.dbPopulated)}');`);
    await driver.executeScript(`localStorage.setItem('dek', '${fixtures.dek}');`);
    await driver.executeScript(`localStorage.setItem('currentFolder', '');`);
    await driver.executeScript(`localStorage.setItem('currentNote', '');`);
    await driver.navigate().refresh();
    await driver.wait(until.elementLocated(By.css('body')), timeout);
    body = await driver.findElement(By.css('body'));
  });
  
  afterEach(async function() {
    // Manually reset the local storage.
    await driver.executeScript('window.localStorage.clear()');
  });
  
  
  describe('Primary', function() {
    it('should pass get breadcrumbs', async function() {
      // Select one folder level down.
      let folders = await body.findElements(By.css('.folder'));
      let folder = folders[0];
      await folder.click();
      
      // Select another folder level down.
      folders = await body.findElements(By.css('.folder'));
      folder = folders[0];
      await folder.click();
      
      // Get first folder element.
      folders = await body.findElements(By.css('.folder'));
      folder = folders[0];
      let breadcrumbs = await folder.getAttribute('title');
      let thirdFolder = fixtures.dbPopulated.folders['b85ecb0a-5398-4189-afd5-9fc1d226d84f'];
      
      let secondFolder = fixtures.dbPopulated.folders[thirdFolder.folder];
      let rootFolder = fixtures.dbPopulated.folders[secondFolder.folder];
      assert.equal('Folder Path: ' + rootFolder.title + ' > ' + secondFolder.title + ' > ', breadcrumbs);
    })
  });
});
