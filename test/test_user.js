const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const mocha = require('mocha');

require('./fixtures/fixtures.js');
let DataLayer = require('./../models/data-layer.js');


describe('Test User', function() {
  before(async function() {
    timeout = 5000;
    dl = new DataLayer();
    driver = await browsers.firefox();
  });
  
  after(async function() {
    driver.quit();
  });
  
  beforeEach(async function() {
    let localIndex = __dirname.slice(0, __dirname.lastIndexOf('/')) + '/index.html';
    await driver.get(`file:///${localIndex}`);
    await driver.wait(until.elementLocated(By.css('body')), timeout);
    body = await driver.findElement(By.css('body'));
  });
  
  afterEach(async function() {
    // Manually reset the local storage.
    await driver.executeScript('window.localStorage.clear()');
  });
  

  describe('Sign Up', function() {
    // Runs before each test.
    beforeEach(async function() {
      /* Navigate to the new user form. */
      let createUserLink = await body.findElement(By.id('createUserLink'));
      await createUserLink.click();
      newUsername = await body.findElement(By.id('newUsername'));
      newPassword1 = await body.findElement(By.id('newPassword1'));
      newPassword2 = await body.findElement(By.id('newPassword2'));
      createUserSubmit = await body.findElement(By.id('createUserSubmit'));
    });
  
    it('should pass create new user', async function() {
      await newUsername.sendKeys('new_test_user');
      await newPassword1.sendKeys('password');
      await newPassword2.sendKeys('password');
      await createUserSubmit.click();
      await driver.wait(until.elementLocated(By.id('menu')), timeout);
      await driver.wait(until.elementLocated(By.id('noteWindow')), timeout);
      let menu = await body.findElement(By.id('menu'));
      let noteWindow = await body.findElement(By.id('noteWindow'));
      assert(menu.isDisplayed());
      assert(noteWindow.isDisplayed());
    })
    
    it('should fail create new user with mismatched passwords', async function() {
      await newUsername.sendKeys('new_test_user');
      await newPassword1.sendKeys('password1');
      await newPassword2.sendKeys('password2');
      await createUserSubmit.click();
      let error = await body.findElement(By.id('createUserError'));
      let errorText = await error.getText();
      assert(error.isDisplayed());
      assert.equal('Passwords do not match', errorText);
    })
    
    it('should fail create new user with blank passwords', async function() {
      await newUsername.sendKeys('new_test_user');
      await createUserSubmit.click();
      
      let error = await body.findElement(By.id('createUserError'));
      let errorText = await error.getText();
      assert(error.isDisplayed());
      assert.equal('Passwords cannot be blank', errorText);
    })
    
    it('should fail create new user with existing username', async function() {
      await driver.executeScript('localStorage.setItem("new_test_user", "mock database")');
      await newUsername.sendKeys('new_test_user');
      await newPassword1.sendKeys('password');
      await newPassword2.sendKeys('password');
      await createUserSubmit.click();
      
      let error = await body.findElement(By.id('createUserError'));
      let errorText = await error.getText();
      assert(error.isDisplayed());
      assert.equal('Username unavailable', errorText);
    })
  });
  
  
  describe('Change Password', function() {
    // Runs before each test.
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
    
    it('should pass change password successfully', async function() {
      let newPassword = 'new password';
      
      // Select the change password link.
      let changePasswordLink = await body.findElement(By.id('changePassword'));
      await changePasswordLink.click();
      
      // Wait for change password form.
      let currentPasswordInput = await body.findElement(By.id('currentPassword'));
      let newPassword1Input = await body.findElement(By.id('newPassword1'));
      let newPassword2Input = await body.findElement(By.id('newPassword2'));
      let changePasswordSubmit = await body.findElement(By.id('changePasswordSubmit'));
      
      // Fill out form and submit.
      await currentPasswordInput.sendKeys(testCreds.password);
      await newPassword1Input.sendKeys(newPassword);
      await newPassword2Input.sendKeys(newPassword);
      await changePasswordSubmit.click();

      // Assert change password input fields are cleared.
      assert.equal('', await currentPasswordInput.getText());
      assert.equal('', await newPassword1Input.getText());
      assert.equal('', await newPassword2Input.getText());
            
      // Logout.
      await driver.wait(until.elementIsNotVisible(changePasswordSubmit));
      let logoutButton = await body.findElement(By.id('logoutButton'));
      await logoutButton.click();
      
      // Login with new password.
      loginUsername = await body.findElement(By.id('loginUsername'));
      loginPassword = await body.findElement(By.id('loginPassword'));
      loginSubmit = await body.findElement(By.id('loginSubmit'));
      await loginUsername.sendKeys(testCreds.username);
      await loginPassword.sendKeys(newPassword);
      await loginSubmit.click();
      
      let usernameHeader = await body.findElement(By.id('usernameHeader'));
      assert.equal(`User: ${testCreds.username}`, await usernameHeader.getText());
    })
    
    it('should pass change password cancel', async function() {
      let newPassword = 'new password';
      
      // Select the change password link.
      let changePasswordLink = await body.findElement(By.id('changePassword'));
      await changePasswordLink.click();
      
      // Wait for change password form.
      let currentPasswordInput = await body.findElement(By.id('currentPassword'));
      let newPassword1Input = await body.findElement(By.id('newPassword1'));
      let newPassword2Input = await body.findElement(By.id('newPassword2'));
      let changePasswordCancel = await body.findElement(By.id('changePasswordCancel'));
      
      // Fill out form and cancel.
      await currentPasswordInput.sendKeys(testCreds.password);
      await newPassword1Input.sendKeys(newPassword);
      await newPassword2Input.sendKeys(newPassword);
      await changePasswordCancel.click();
      
      // Assert change password input fields are cleared.
      assert.equal('', await currentPasswordInput.getText());
      assert.equal('', await newPassword1Input.getText());
      assert.equal('', await newPassword2Input.getText());
      
      // Logout.
      await driver.wait(until.elementIsNotVisible(changePasswordCancel));
      let logoutButton = await body.findElement(By.id('logoutButton'));
      await logoutButton.click();
      
      // Attempt to login with new password (should fail).
      loginUsername = await body.findElement(By.id('loginUsername'));
      loginPassword = await body.findElement(By.id('loginPassword'));
      loginSubmit = await body.findElement(By.id('loginSubmit'));
      await loginUsername.sendKeys(testCreds.username);
      await loginPassword.sendKeys(newPassword);
      await loginSubmit.click();
      
      loginError = await body.findElement(By.id('loginError'));
      assert.equal('Invalid username or password', await loginError.getText());
    })
    
    it('should fail change password with invalid current password', async function() {
      let invalidCurrentPassword = 'invalid password';
      let newPassword = 'new password';
      
      // Select the change password link.
      let changePasswordLink = await body.findElement(By.id('changePassword'));
      await changePasswordLink.click();
      
      // Wait for change password form.
      let currentPasswordInput = await body.findElement(By.id('currentPassword'));
      let newPassword1Input = await body.findElement(By.id('newPassword1'));
      let newPassword2Input = await body.findElement(By.id('newPassword2'));
      let changePasswordSubmit = await body.findElement(By.id('changePasswordSubmit'));
      let changePasswordCancel = await body.findElement(By.id('changePasswordCancel'));
      let changePasswordError = await body.findElement(By.id('changePasswordError'));
      
      // Fill out form, attempt to submit and cancel.
      await currentPasswordInput.sendKeys(invalidCurrentPassword);
      await newPassword1Input.sendKeys(newPassword);
      await newPassword2Input.sendKeys(newPassword);
      await changePasswordSubmit.click();
      assert('Current password is invalid', await changePasswordError.getText()); 
      await changePasswordCancel.click();
      
      // Assert change password input fields are cleared.
      assert.equal('', await currentPasswordInput.getText());
      assert.equal('', await newPassword1Input.getText());
      assert.equal('', await newPassword2Input.getText());
      
      // Logout.
      await driver.wait(until.elementIsNotVisible(changePasswordCancel));
      let logoutButton = await body.findElement(By.id('logoutButton'));
      await logoutButton.click();
      
      // Attempt to login with new password (should fail).
      loginUsername = await body.findElement(By.id('loginUsername'));
      loginPassword = await body.findElement(By.id('loginPassword'));
      loginSubmit = await body.findElement(By.id('loginSubmit'));
      await loginUsername.sendKeys(testCreds.username);
      await loginPassword.sendKeys(newPassword);
      await loginSubmit.click();
      
      loginError = await driver.findElement(By.id('loginError'));
      assert.equal('Invalid username or password', await loginError.getText());
    })
    
    it('should fail change password with mismatched new passwords', async function() {
      let newPassword1 = 'newPassword1';
      let newPassword2 = 'newPassword2';
      
      // Select the change password link.
      let changePasswordLink = await body.findElement(By.id('changePassword'));
      await changePasswordLink.click();
      
      // Wait for change password form.
      let currentPasswordInput = await body.findElement(By.id('currentPassword'));
      let newPassword1Input = await body.findElement(By.id('newPassword1'));
      let newPassword2Input = await body.findElement(By.id('newPassword2'));
      let changePasswordSubmit = await body.findElement(By.id('changePasswordSubmit'));
      let changePasswordCancel = await body.findElement(By.id('changePasswordCancel'));
      let changePasswordError = await body.findElement(By.id('changePasswordError'));
      
      // Fill out form, attempt to submit and cancel.
      await currentPasswordInput.sendKeys(testCreds.password);
      await newPassword1Input.sendKeys(newPassword1);
      await newPassword2Input.sendKeys(newPassword2);
      await changePasswordSubmit.click();
      assert('New passwords do not match', await changePasswordError.getText()); 
      await changePasswordCancel.click();
      
      // Assert change password input fields are cleared.
      assert.equal('', await currentPasswordInput.getText());
      assert.equal('', await newPassword1Input.getText());
      assert.equal('', await newPassword2Input.getText());
      
      // Logout.
      await driver.wait(until.elementIsNotVisible(changePasswordCancel));
      let logoutButton = await body.findElement(By.id('logoutButton'));
      await logoutButton.click();
      
      // Login with current password.
      loginUsername = await body.findElement(By.id('loginUsername'));
      loginPassword = await body.findElement(By.id('loginPassword'));
      loginSubmit = await body.findElement(By.id('loginSubmit'));
      await loginUsername.sendKeys(testCreds.username);
      await loginPassword.sendKeys(testCreds.password);
      await loginSubmit.click();
      
      let usernameHeader = await body.findElement(By.id('usernameHeader'));
      assert.equal(`User: ${testCreds.username}`, await usernameHeader.getText());
    })
    
    it('should fail change password with blank current password', async function() {
      let newPassword = 'newPassword';
      
      // Select the change password link.
      let changePasswordLink = await body.findElement(By.id('changePassword'));
      await changePasswordLink.click();
      
      // Wait for change password form.
      let currentPasswordInput = await body.findElement(By.id('currentPassword'));
      let newPassword1Input = await body.findElement(By.id('newPassword1'));
      let newPassword2Input = await body.findElement(By.id('newPassword2'));
      let changePasswordSubmit = await body.findElement(By.id('changePasswordSubmit'));
      let changePasswordCancel = await body.findElement(By.id('changePasswordCancel'));
      let changePasswordError = await body.findElement(By.id('changePasswordError'));
      
      // Fill out form, attempt to submit and cancel.
      await currentPasswordInput.sendKeys('');
      await newPassword1Input.sendKeys(newPassword);
      await newPassword2Input.sendKeys(newPassword);
      await changePasswordSubmit.click();
      assert('Passwords cannot be blank', await changePasswordError.getText()); 
      await changePasswordCancel.click();
      
      // Assert change password input fields are cleared.
      assert.equal('', await currentPasswordInput.getText());
      assert.equal('', await newPassword1Input.getText());
      assert.equal('', await newPassword2Input.getText());
      
      // Logout.
      await driver.wait(until.elementIsNotVisible(changePasswordCancel));
      let logoutButton = await body.findElement(By.id('logoutButton'));
      await logoutButton.click();
      
      // Attempt to login with new password (should fail).
      loginUsername = await body.findElement(By.id('loginUsername'));
      loginPassword = await body.findElement(By.id('loginPassword'));
      loginSubmit = await body.findElement(By.id('loginSubmit'));
      await loginUsername.sendKeys(testCreds.username);
      await loginPassword.sendKeys(newPassword);
      await loginSubmit.click();
      
      loginError = await body.findElement(By.id('loginError'));
      assert.equal('Invalid username or password', await loginError.getText());
    })
    
    it('should fail change password with blank new passwords', async function() {
      // Select the change password link.
      let changePasswordLink = await body.findElement(By.id('changePassword'));
      await changePasswordLink.click();
      
      // Wait for change password form.
      let currentPasswordInput = await body.findElement(By.id('currentPassword'));
      let newPassword1Input = await body.findElement(By.id('newPassword1'));
      let newPassword2Input = await body.findElement(By.id('newPassword2'));
      let changePasswordSubmit = await body.findElement(By.id('changePasswordSubmit'));
      let changePasswordCancel = await body.findElement(By.id('changePasswordCancel'));
      let changePasswordError = await body.findElement(By.id('changePasswordError'));
      
      // Fill out form, attempt to submit and cancel.
      await currentPasswordInput.sendKeys(testCreds.password);
      await newPassword1Input.sendKeys('');
      await newPassword2Input.sendKeys('');
      await changePasswordSubmit.click();
      assert('Passwords cannot be blank', await changePasswordError.getText()); 
      await changePasswordCancel.click();
      
      // Assert change password input fields are cleared.
      assert.equal('', await currentPasswordInput.getText());
      assert.equal('', await newPassword1Input.getText());
      assert.equal('', await newPassword2Input.getText());
      
      // Logout.
      await driver.wait(until.elementIsNotVisible(changePasswordCancel));
      let logoutButton = await body.findElement(By.id('logoutButton'));
      await logoutButton.click();
      
      // Login with current password.
      loginUsername = await body.findElement(By.id('loginUsername'));
      loginPassword = await body.findElement(By.id('loginPassword'));
      loginSubmit = await body.findElement(By.id('loginSubmit'));
      await loginUsername.sendKeys(testCreds.username);
      await loginPassword.sendKeys(testCreds.password);
      await loginSubmit.click();
      
      //await driver.wait(until.stalenessOf(loginSubmit));
      let usernameHeader = await body.findElement(By.id('usernameHeader'));
      assert.equal(`User: ${testCreds.username}`, await usernameHeader.getText());
    })
  });
  
  
  describe('Import Database', function() {
    // Runs before each test.
    beforeEach(async function() {
      // Set database to populated.
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
      await driver.executeScript(`$('#importDBModal').removeClass('fade');`);
    })
    
    it('should pass import database cancel', async function() {
      let ulFilename = `${__dirname}/temp/temp_test_database.json`;
      try { fs.unlinkSync(ulFilename); } catch { ; }  // Ensure file does not exist.
      
      // Manually set the file upload filename.
      let importDBFile = await body.findElement(By.id('importDBFile'));
      fs.writeFileSync(ulFilename, JSON.stringify(fixtures.encDBEmpty));
      await importDBFile.sendKeys(ulFilename);
      let importDBCancel = await body.findElement(By.id('importDBCancel'));
      await importDBCancel.click();
      
      // Assert profile remains the same as before the import attempt.
      let importedDB = await driver.executeScript(`return localStorage.getItem('${testCreds.username}');`);
      assert.equal(JSON.stringify(fixtures.encDBPopulated), importedDB);
      fs.unlinkSync(ulFilename);
    })
    
    it('should pass import plaintext database submit', async function() {
      // Set database to empty to ensure it is populated by the import.
      await driver.executeScript(`localStorage.setItem('username', '${testCreds.username}');`);
      await driver.executeScript(`localStorage.setItem('${testCreds.username}', '${JSON.stringify(fixtures.encDBEmpty)}');`);
      await driver.executeScript(`localStorage.setItem('db', '${JSON.stringify(fixtures.dbEmpty)}');`);
      await driver.executeScript(`localStorage.setItem('dek', '${fixtures.dek}');`);
      await driver.executeScript(`localStorage.setItem('currentFolder', '');`);
      await driver.executeScript(`localStorage.setItem('currentNote', '');`);
      await driver.navigate().refresh();
      await driver.wait(until.elementLocated(By.css('body')), timeout);
      body = await driver.findElement(By.css('body'));
      
      let ulFilename = `${__dirname}/temp/temp_test_database.json`;
      try { fs.unlinkSync(ulFilename); } catch { ; }  // Ensure file does not exist.
      
      // Disable bootstrap modal fade which causes issues with detecting web element.
      await driver.executeScript(`$('#importDBModal').removeClass('fade');`);
      
      // Manually set the file upload filename.
      let importDBFile = await body.findElement(By.id('importDBFile'));
      fs.writeFileSync(ulFilename, JSON.stringify(fixtures.decDBPopulated));
      await importDBFile.sendKeys(ulFilename);
      let importDBSubmit = await body.findElement(By.id('importDBSubmit'));
      await importDBSubmit.click();

      // Assert new profile matches the imported file file.
      let importedDB = await driver.executeScript(`return JSON.parse(localStorage.getItem('${testCreds.username}'));`);
      importedDB.db = dl.decrypt(importedDB.db, fixtures.dek);
      importedDB = { db: importedDB.db, salt: importedDB.salt, dek: importedDB.dek };  // Important!
      await driver.wait(until.elementLocated(By.css('.toast-success')), timeout);
      let temp = JSON.parse(JSON.stringify(fixtures.encDBPopulated));  // Clone fixture.
      temp.db = dl.decrypt(temp.db, fixtures.dek);
      assert.equal(JSON.stringify(temp), JSON.stringify(importedDB));
      fs.unlinkSync(ulFilename);
    })
    
    it('should pass import encrypted database submit', async function() {
      // Set database to empty to ensure it is populated by the import.
      await driver.executeScript(`localStorage.setItem('username', '${testCreds.username}');`);
      await driver.executeScript(`localStorage.setItem('${testCreds.username}', '${JSON.stringify(fixtures.encDBEmpty)}');`);
      await driver.executeScript(`localStorage.setItem('db', '${JSON.stringify(fixtures.dbEmpty)}');`);
      await driver.executeScript(`localStorage.setItem('dek', '${fixtures.dek}');`);
      await driver.executeScript(`localStorage.setItem('currentFolder', '');`);
      await driver.executeScript(`localStorage.setItem('currentNote', '');`);
      await driver.navigate().refresh();
      await driver.wait(until.elementLocated(By.css('body')), timeout);
      body = await driver.findElement(By.css('body'));
      
      let ulFilename = `${__dirname}/temp/temp_test_database.json`;
      try { fs.unlinkSync(ulFilename); } catch { ; }  // Ensure file does not exist.
      
      // Disable bootstrap modal fade which causes issues with detecting web element.
      await driver.executeScript(`$('#importDBModal').removeClass('fade');`);
      
      // Manually set the file upload filename.
      let importDBFile = await body.findElement(By.id('importDBFile'));
      fs.writeFileSync(ulFilename, JSON.stringify(fixtures.encDBPopulated));
      await importDBFile.sendKeys(ulFilename);
      let importDBSubmit = await body.findElement(By.id('importDBSubmit'));
      await importDBSubmit.click();

      // Assert new profile matches the imported file file.
      let importedDB = await driver.executeScript(`return localStorage.getItem('${testCreds.username}');`);
      await driver.wait(until.elementLocated(By.css('.toast-success')), timeout);
      assert.equal(JSON.stringify(fixtures.encDBPopulated), importedDB);
      fs.unlinkSync(ulFilename);
    })
    
    it('should fail import invalid profile submit', async function() {
      let ulFilename = `${__dirname}/temp/temp_test_database.json`;
      try { fs.unlinkSync(ulFilename); } catch { ; }  // Ensure file does not exist.
      
      // Manually set the file upload filename.
      let importDBFile = await body.findElement(By.id('importDBFile'));
      fs.writeFileSync(ulFilename, JSON.stringify(fixtures.invalidProfile));
      await importDBFile.sendKeys(ulFilename);
      let importDBSubmit = await body.findElement(By.id('importDBSubmit'));
      await importDBSubmit.click();

      // Assert existing profile is not overwritten by import.
      let importedDB = await driver.executeScript(`return localStorage.getItem('${testCreds.username}');`);
      await driver.wait(until.elementLocated(By.css('.toast-error')), timeout);
      assert.equal(JSON.stringify(fixtures.encDBPopulated), importedDB);
      fs.unlinkSync(ulFilename);
    })
    
    it('should fail import invalid plaintext database submit', async function() {
      let ulFilename = `${__dirname}/temp/temp_test_database.json`;
      try { fs.unlinkSync(ulFilename); } catch { ; }  // Ensure file does not exist.
      
      // Manually set the file upload filename.
      let importDBFile = await body.findElement(By.id('importDBFile'));
      fs.writeFileSync(ulFilename, JSON.stringify(fixtures.invalidDBPlaintext));
      await importDBFile.sendKeys(ulFilename);
      let importDBSubmit = await body.findElement(By.id('importDBSubmit'));
      await importDBSubmit.click();

      // Assert existing profile is not overwritten by import.
      let importedDB = await driver.executeScript(`return localStorage.getItem('${testCreds.username}');`);
      await driver.wait(until.elementLocated(By.css('.toast-error')), timeout);
      assert.equal(JSON.stringify(fixtures.encDBPopulated), importedDB);
      fs.unlinkSync(ulFilename);
    })
    
    it('should fail import invalid encrypted database submit', async function() {
      let ulFilename = `${__dirname}/temp/temp_test_database.json`;
      try { fs.unlinkSync(ulFilename); } catch { ; }  // Ensure file does not exist.
      
      // Manually set the file upload filename.
      let importDBFile = await body.findElement(By.id('importDBFile'));
      fs.writeFileSync(ulFilename, JSON.stringify(fixtures.invalidDBCiphertext));
      await importDBFile.sendKeys(ulFilename);
      let importDBSubmit = await body.findElement(By.id('importDBSubmit'));
      await importDBSubmit.click();

      // Assert existing profile is not overwritten by import.
      let importedDB = await driver.executeScript(`return localStorage.getItem('${testCreds.username}');`);
      await driver.wait(until.elementLocated(By.css('.toast-error')), timeout);
      assert.equal(JSON.stringify(fixtures.encDBPopulated), importedDB);
      fs.unlinkSync(ulFilename);
    })
  });
  
  describe('Export Database', function() {
    // Runs before each test.
    beforeEach(async function() {
      // Set database to populated.
      await driver.executeScript(`localStorage.setItem('username', '${testCreds.username}');`);
      await driver.executeScript(`localStorage.setItem('${testCreds.username}', '${JSON.stringify(fixtures.encDBPopulated)}');`);
      await driver.executeScript(`localStorage.setItem('db', '${JSON.stringify(fixtures.dbPopulated)}');`);
      await driver.executeScript(`localStorage.setItem('dek', '${fixtures.dek}');`);
      await driver.executeScript(`localStorage.setItem('currentFolder', '');`);
      await driver.executeScript(`localStorage.setItem('currentNote', '');`);
      await driver.navigate().refresh();
      await driver.wait(until.elementLocated(By.css('body')), timeout);
      body = await driver.findElement(By.css('body'));
    })
    
    it('should pass export plaintext database', async function() {
      let dlFilename = `${__dirname}/temp/${testCreds.username}-db-backup.json`;
      try { fs.unlinkSync(dlFilename); } catch { ; }  // Ensure file does not exist.
      
      // Select the export database link.
      let exportDB = await body.findElement(By.id('exportDB'));
      await exportDB.click();
      
      // Select plaintext format and submit.
      let exportDBPlaintext = await body.findElement(By.id('exportDBPlaintext'));
      let exportDBSubmit = await body.findElement(By.id('exportDBSubmit'));
      await exportDBPlaintext.click();
      await exportDBSubmit.click();
      
      // Assert downloaded file matches the existing database, then remove file.
      let data = fs.readFileSync(dlFilename);
      assert.equal(JSON.stringify(fixtures.decDBPopulated), data.toString());
      fs.unlinkSync(dlFilename);
    })
    
    it('should pass export encrypted database', async function() {
      let dlFilename = `${__dirname}/temp/${testCreds.username}-db-backup.json.enc`;
      try { fs.unlinkSync(dlFilename); } catch { ; }  // Ensure file does not exist.
      
      // Select the export database link.
      let exportDB = await body.findElement(By.id('exportDB'));
      await exportDB.click();
      
      // Select plaintext format and submit.
      let exportDBCiphertext = await body.findElement(By.id('exportDBCiphertext'));
      let exportDBSubmit = await body.findElement(By.id('exportDBSubmit'));
      await exportDBCiphertext.click();
      await exportDBSubmit.click();
      
      // Assert downloaded file matches the existing database, then remove file.
      let data = fs.readFileSync(dlFilename);
      assert.equal(JSON.stringify(fixtures.encDBPopulated), data.toString());
      fs.unlinkSync(dlFilename);
    })
  });
});
