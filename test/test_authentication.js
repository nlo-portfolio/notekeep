const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const mocha = require('mocha');

require('./fixtures/fixtures.js');


describe('Test Authentication', function() {
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
  });
  
  describe('Login', function() {
    beforeEach(async function() {
      await driver.executeScript(`localStorage.setItem('test_user', '${JSON.stringify(fixtures.encDBEmpty)}');`);
      await driver.executeScript(`return JSON.parse(window.localStorage.getItem('test_user'));`);
      await driver.wait(until.elementLocated(By.css('body')), timeout);
      body = await driver.findElement(By.css('body'));
      loginUsername = await body.findElement(By.id('loginUsername'));
      loginPassword = await body.findElement(By.id('loginPassword'));
      loginSubmit = await body.findElement(By.id('loginSubmit'));
    });
  
    afterEach(async function() {
      // Manually reset the local storage.
      await driver.executeScript('window.localStorage.clear()');
    });
  
    it('should pass login', async function() {
      await loginUsername.sendKeys(`${testCreds.username}`);
      await loginPassword.sendKeys(`${testCreds.password}`);
      await loginSubmit.click();
      await driver.wait(until.elementLocated(By.id('menu')), timeout);
      await driver.wait(until.elementLocated(By.id('noteWindow')), timeout);
      let menu = await body.findElement(By.id('menu'));
      let noteWindow = await body.findElement(By.id('noteWindow'));
      assert(menu.isDisplayed());
      assert(noteWindow.isDisplayed());
    })
    
    it('should fail login with invalid username', async function() {
      await loginUsername.sendKeys('invalid_username');
      await loginPassword.sendKeys(`${testCreds.password}`);
      await loginSubmit.click();
      
      let error = await body.findElement(By.id('loginError'));
      let errorText = await error.getText();
      assert(error.isDisplayed());
      assert.equal('Invalid username or password', errorText);
    })
    
    it('should fail login with invalid password', async function() {
      await loginUsername.sendKeys(`${testCreds.username}`);
      await loginPassword.sendKeys('invalid_password');
      await loginSubmit.click();
      
      let error = await body.findElement(By.id('loginError'));
      let errorText = await error.getText();
      assert(error.isDisplayed());
      assert.equal('Invalid username or password', errorText);
    })
  });
  
  describe('Logout', function() {
    beforeEach(async function() {
      await driver.executeScript(`localStorage.setItem('username', '${testCreds.username}');`);
      await driver.executeScript(`localStorage.setItem('${testCreds.username}', '${JSON.stringify(fixtures.encDBPopulated)}');`);
      await driver.executeScript(`localStorage.setItem('db', '${JSON.stringify(fixtures.dbPopulated)}');`);
      await driver.executeScript(`localStorage.setItem('dek', '${fixtures.dek}');`);
      await driver.executeScript(`localStorage.setItem('currentFolder', '');`);
      await driver.executeScript(`localStorage.setItem('currentNote', '');`);
      await driver.navigate().refresh();
      await driver.wait(until.elementLocated(By.css('body')), timeout);
      body = await driver.findElement(By.css('body'));
      
      // Disable bootstrap modal fade which causes issues with detecting web element.
      await driver.executeScript(`$('#changePasswordModal').removeClass('fade');`);
    })
    
    it('should pass logout successfully', async function() {
      let logoutButton = await body.findElement(By.id('logoutButton'));
      await logoutButton.click();
      
      // Assert logout success message is displayed.
      let message = await body.findElement(By.id('logoutSuccess'));
      let logoutText = await message.getText();
      assert(message.isDisplayed());
      assert.equal('You have been logged out successfully', logoutText);
      
      // Assert authenticated local storage items are removed.
      let username = await driver.executeScript(`return localStorage.getItem('username')`);
      let localDB = await driver.executeScript(`return localStorage.getItem('db')`);
      let dek = await driver.executeScript(`return localStorage.getItem('dek')`);
      let currentFolder = await driver.executeScript(`return localStorage.getItem('currentFolder')`);
      let currentNote = await driver.executeScript(`return localStorage.getItem('currentNote')`);
      assert.equal('', username);
      assert.equal('', localDB);
      assert.equal('', dek);
      assert.equal('', currentFolder);
      assert.equal('', currentNote);
    })
  });
  
});
