const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const mocha = require('mocha');

require('./fixtures/fixtures.js');
let DataLayer = require('./../models/data-layer.js');


describe('Test Folder', function() {
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
    it('should pass select/read folder', async function() {
      // Assert that a note becomes active in the navigation when selected.
      let folders = await body.findElements(By.css('.folder'));
      let folder = folders[0];
      await folder.click();
      
      // Select a note in the selected folder.
      notes = await body.findElements(By.css('.note'));
      note = notes[0];
      let uuid = await note.getAttribute('uuid');
      assert(uuid);
      // ASSERT note.uuid == db.notes[uuid].folder;
    })
    
    it('should pass create new folder', async function() {
      let folderTitle = 'This is the new folder title.';
      
      // Get folder item count before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      let countBefore = Object.keys(decDB.folders).length;
      
      // Get note item on front page to detect when it becomes stale.
      let notes = await body.findElements(By.css('.note'));
      let note = notes[0];
      
      // Disable bootstrap modal fade which causes issues with detecting web element.
      await driver.executeScript(`$('#trashFolderModal').removeClass('fade');`);
      
      // Click on the create folder button.
      let createFolderButton = await body.findElement(By.id('createFolder'));
      await createFolderButton.click();
      
      let folderTitleInput = await body.findElement(By.id('newFolderTitle'));
      let createFolderSubmit = await body.findElement(By.id('createFolderSubmit'));
      await folderTitleInput.sendKeys(folderTitle);
      await createFolderSubmit.click();
      
      // Ensure new folder has been opened on creation.
      await driver.wait(until.stalenessOf(note), timeout);
      
      // Assert new folder has been saved to the db.
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(countBefore + 1, Object.keys(decDB.folders).length);
      let newFolder = Object.entries(decDB.folders)[Object.entries(decDB.folders).length - 1][1];
      assert.equal(folderTitle, await newFolder.title);
    })
    
    it('should pass edit folder', async function() {
      let newFolderTitle = 'This is the new folder title.';
      
      let editFolderButtons = await body.findElements(By.css('.editFolder'));
      let editFolderButton = editFolderButtons[0];
      let uuid = await editFolderButton.getAttribute('uuid');
      await editFolderButton.click();
      
      // Fetch folder title and location.
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      let folder = decDB.folders[uuid];
      assert.equal('Test Folder 1', folder.title);
      assert.equal('', folder.folder);
      
      // Edit folder title and folder location.
      let editFolderTitle = await body.findElement(By.id('editFolderTitle'));
      let editFolderListContainer = await body.findElement(By.id('editFolderListContainer'));
      let options = await editFolderListContainer.findElements(By.css('option'));
      let option = options[options.length - 1];
      let editFolderSubmit = await body.findElement(By.id('editFolderSubmit'));
      let currentFolderTitle = await editFolderTitle.getAttribute('value');
      await editFolderTitle.clear();
      await editFolderTitle.sendKeys(newFolderTitle);
      await option.click();
      await editFolderSubmit.click();

      // Assert folder title is modified and that folder is moved to the new location.
      await driver.wait(until.elementIsNotVisible(editFolderSubmit));  // Modal disappears.
      await driver.wait(until.stalenessOf(editFolderButton));
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      folder = decDB.folders[uuid];
      assert.equal(newFolderTitle, folder.title);
      assert.equal('ce19d292-ee8d-47aa-91fa-912bd64b85b0', folder.folder);
    })
    
    it('should pass delete folder', async function() {
      // Fetch db before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      
      // Fetch a delete folder button.
      let deleteFolderButtons = await body.findElements(By.css('.deleteFolder'));
      let deleteFolderButton = deleteFolderButtons[0];
      let uuid = await deleteFolderButton.getAttribute('uuid');
      
      // Assert folder exists before deleting and is not in trash.
      assert(decDB.folders[uuid]);
      assert.equal(undefined, decDB.trash.folders[uuid]);
      
      // Click on the delete folder button.
      await deleteFolderButton.click();
      
      // Assert folder has been removed from the db and moved to the trash.
      await driver.wait(until.stalenessOf(deleteFolderButton));
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(undefined, decDB.folders[uuid]);
      assert(decDB.trash.folders[uuid]);
    })
  });
  
  describe('Trash', function() {  
    it('should pass trash folder confirm', async function() {
      // Fetch db before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      
      // Show trash items.
      let showTrashButton = await body.findElement(By.id('showTrash'));
      await showTrashButton.click();
      
      // Fetch a trash folder button.
      let trashFolderButtons = await body.findElements(By.css('.trashFolder'));
      let trashFolderButton = trashFolderButtons[0];
      let uuid = await trashFolderButton.getAttribute('uuid');
      
      // Assert folder exists in trash before deleting.
      assert(decDB.trash.folders[uuid]);
      
      // Click on the trash folder button.
      await trashFolderButton.click();
      
      // Click 'confirm' button on trash folder modal.
      let trashFolderSubmit = await body.findElement(By.id('trashFolderSubmit'));
      await trashFolderSubmit.click();
      
      // Assert folder has been permanently deleted from the trash.
      await driver.wait(until.stalenessOf(trashFolderButton));
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(undefined, decDB.trash.folders[uuid]);
    })
    
    it('should pass trash folder cancel', async function() {
      // Get trash item count before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      
      // Show trash items.
      let showTrashButton = await body.findElement(By.id('showTrash'));
      await showTrashButton.click();
      
      // Fetch a trash folder button.
      let trashFolderButtons = await body.findElements(By.css('.trashFolder'));
      let trashFolderButton = trashFolderButtons[0];
      let uuid = await trashFolderButton.getAttribute('uuid');
      
      // Assert folder exists in trash before deleting.
      assert(decDB.trash.folders[uuid]);
      
      // Disable bootstrap modal fade which causes issues with detecting web element.
      await driver.executeScript(`$('#trashFolderModal').removeClass('fade');`);
      
      // Click on the trash folder button.
      await trashFolderButton.click();
      
      // Click 'cancel' button on trash folder modal.
      let trashFolderCancel = await body.findElement(By.id('trashFolderCancel'));
      await trashFolderCancel.click();
      
      // Assert folder is still in the trash.
      await driver.wait(until.elementIsNotVisible(trashFolderCancel), timeout);
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert(decDB.trash.folders[uuid]);
    })
    
    it('should pass restore folder', async function() {
      // Show trash items.
      let showTrashButton = await body.findElement(By.id('showTrash'));
      await showTrashButton.click();
      
      // Fetch first trashed items and buttons.
      let restoreFolderButtons = await body.findElements(By.css('.restoreFolder'));
      let restoreFolderButton = restoreFolderButtons[0];
      let uuid = await restoreFolderButton.getAttribute('uuid');
      
      // Assert folder is removed from the trash and moved back to the main database.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert(decDB.trash.folders[uuid]);
      await restoreFolderButton.click();
      await driver.wait(until.stalenessOf(restoreFolderButton)); // Modal disappears.
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert(decDB.folders[uuid]);  // Folder is moved from to trash to db.
      assert.equal(undefined, decDB.trash.folders[uuid]);  // Folder is removed from trash.
    })
  });
});
