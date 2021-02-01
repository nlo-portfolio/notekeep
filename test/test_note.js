const { By, until } = require('selenium-webdriver');
const assert = require('assert');
const mocha = require('mocha');

require('./fixtures/fixtures.js');
let DataLayer = require('./../models/data-layer.js');


describe('Test Note', function() {
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
    it('should pass select/read note', async function() {
      // Assert that a note becomes active in the navigation when selected.
      let notes = await body.findElements(By.css('.note'));
      let note = notes[0];
      await note.click();
      // Old notes become stale after selection, so need to re-query them.
      notes = await body.findElements(By.css('.note'));
      note = notes[0];
      let uuid = await note.getAttribute('uuid');
      let css = await note.getAttribute('class');
      assert(css.includes('active'));
      
      // Assert note window is populated with note data when selected.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      let noteTitle = await body.findElement(By.id('noteTitle'));
      let noteBody = await body.findElement(By.id('noteBody'));
      assert.equal(decDB.notes[uuid].title, await noteTitle.getAttribute('value'));
      assert.equal(decDB.notes[uuid].body, await noteBody.getAttribute('value'));
    })
    
    it('should pass create new note', async function() {
      // Get note item count before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      let countBefore = Object.keys(decDB.notes).length;
      
      // Click on the create note button.
      let createNoteButton = await body.findElement(By.id('createNote'));
      await createNoteButton.click();
      
      // Assert new note has been saved to the db.
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(countBefore + 1, Object.keys(decDB.notes).length);
    })
    
    it('should pass edit note', async function() {
      let newNoteTitle = 'This is the new note title.';
      let newNoteBody = 'This is the new note body.';
      
      // Select an existing note.
      let noteItems = await body.findElements(By.css('.note'));
      let noteItem = noteItems[0];
      let uuid = await noteItem.getAttribute('uuid');
      await noteItem.click();
      
      // Fetch note title and location.
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      let note = decDB.notes[uuid];
      assert.equal('Test Note 1', note.title);
      assert.equal('Test Body 1', note.body);
      assert.equal('', note.folder);
      
      // Edit note title, body and folder location.
      let noteTitle = await body.findElement(By.id('noteTitle'));
      let noteBody = await body.findElement(By.id('noteBody'));
      let noteFolderList = await body.findElement(By.id('folderList'));
      let options = await body.findElements(By.css('option'));
      let option = options[options.length - 1];
      await noteTitle.clear();
      await noteBody.clear();
      await noteTitle.sendKeys(newNoteTitle);
      await noteBody.sendKeys(newNoteBody);
      await option.click();

      // Click on the save note button.
      let saveNote = await body.findElement(By.id('saveNote'));
      await driver.executeScript('$(document).scrollLeft(0);');  // Ensure save button is in view and clickable.
      await saveNote.click();
      
      // Assert note title and body are modified and that note is moved to the new location.
      await driver.wait(until.stalenessOf(noteItem));
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      note = decDB.notes[uuid];
      assert.equal(newNoteTitle, note.title);
      assert.equal(newNoteBody, note.body);
      assert.equal('ce19d292-ee8d-47aa-91fa-912bd64b85b0', note.folder);
    })
    
    it('should pass save note', async function() {
      let titleText = 'This is a test title.';
      let bodyText = 'This is some test body text.';
      
      // Get note item count before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      let countBefore = Object.keys(decDB.notes).length;
      
      // Click on the create note button.
      let createNoteButton = await body.findElement(By.id('createNote'));
      await createNoteButton.click();
      
      // Enter text into note window.
      let noteTitle = await body.findElement(By.id('noteTitle'));
      let noteBody = await body.findElement(By.id('noteBody'));
      await noteTitle.sendKeys(titleText);
      await noteBody.sendKeys(bodyText);
      
      // Click on the save note button.
      let saveNote = await body.findElement(By.id('saveNote'));
      await driver.executeScript('$(document).scrollLeft(0);');  // Ensure save button is in view and clickable.
      await saveNote.click();
      //await driver.navigate().refresh();
      
      // Assert note and text has been saved to the db.
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(countBefore + 1, Object.keys(decDB.notes).length);
      let newNote = Object.entries(decDB.notes)[Object.entries(decDB.notes).length - 1][1];
      assert.equal(titleText, await newNote.title);
      assert.equal(bodyText, await newNote.body);
    })
    
    it('should pass delete note', async function() {
      // Fetch db before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      
      // Fetch a delete note button.
      let deleteNoteButtons = await body.findElements(By.css('.deleteNote'));
      let deleteNoteButton = deleteNoteButtons[0];
      let uuid = await deleteNoteButton.getAttribute('uuid');
      
      // Assert note exists before deleting and is not in trash.
      assert(decDB.notes[uuid]);
      assert.equal(undefined, decDB.trash.notes[uuid]);
      
      // Click on the delete note button.
      await deleteNoteButton.click();
      
      // Assert note has been removed from the db and moved to the trash.
      await driver.wait(until.stalenessOf(deleteNoteButton));
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(undefined, decDB.notes[uuid]);
      assert(decDB.trash.notes[uuid]);
    })
  });
  
  
  describe('Trash', function() {
    // Runs before each test.
    beforeEach(async function() {
      // Disable bootstrap modal fade which causes issues with detecting web element.
      await driver.executeScript(`$('#trashNoteModal').removeClass('fade');`);
    })
    
    it('should pass trash note confirm', async function() {
      // Fetch db before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      
      // Show trash items.
      let showTrashButton = await body.findElement(By.id('showTrash'));
      await showTrashButton.click();
      
      // Fetch a trash note button.
      let trashNoteButtons = await body.findElements(By.css('.trashNote'));
      let trashNoteButton = trashNoteButtons[0];
      let uuid = await trashNoteButton.getAttribute('uuid');
      
      // Assert note exists in trash before deleting.
      assert(decDB.trash.notes[uuid]);
      
      // Click on the trash note button.
      await trashNoteButton.click();
      
      // Click 'confirm' button on trash note modal.
      let trashNoteSubmit = await body.findElement(By.id('trashNoteSubmit'));
      await trashNoteSubmit.click();
      
      // Assert note has been permanently deleted from the trash.
      await driver.wait(until.stalenessOf(trashNoteButton));
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(undefined, decDB.trash.notes[uuid]);
    })
    
    it('should pass trash note cancel', async function() {
      // Get trash item count before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      
      // Show trash items.
      let showTrashButton = await body.findElement(By.id('showTrash'));
      await showTrashButton.click();
      
      // Fetch a trash note item.
      let trashNoteButtons = await body.findElements(By.css('.trashNote'));
      let trashNoteButton = trashNoteButtons[0];
      let uuid = await trashNoteButton.getAttribute('uuid');
      
      // Assert note exists in trash before cancelling.
      assert(decDB.trash.notes[uuid]);
      
      // Click on the trash note button.
      await trashNoteButton.click();
      
      // Click 'cancel' button on save note modal.
      //await driver.executeScript('$.fn.modal.Constructor.prototype._enforceFocus = function() {};');
      let trashNoteModal = await body.findElement(By.id('trashNoteModal'));
      let trashNoteCancel = await body.findElement(By.id('trashNoteCancel'));
      await trashNoteCancel.click();

      // Assert note is still in the trash.
      await driver.wait(until.elementIsNotVisible(trashNoteCancel), timeout);
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert(decDB.trash.notes[uuid]);
    })
    
    it('should pass restore note', async function() {
      // Show trash items.
      let showTrashButton = await body.findElement(By.id('showTrash'));
      await showTrashButton.click();
      
      // Fetch first trashed items and buttons.
      let restoreNoteButtons = await body.findElements(By.css('.restoreNote'));
      let restoreNoteButton = restoreNoteButtons[0];
      let uuid = await restoreNoteButton.getAttribute('uuid');
      
      // Assert note is removed from the trash and moved back to the main database.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert(decDB.trash.notes[uuid]);
      await restoreNoteButton.click();
      await driver.wait(until.stalenessOf(restoreNoteButton));      
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert(decDB.notes[uuid]);  // Note is moved from to trash to db.
      assert.equal(undefined, decDB.trash.notes[uuid]);  // Note is removed from trash.
    })
  });
  
  describe('Rescue', function() {
    // Runs before each test.
    beforeEach(async function() {
      // Disable bootstrap modal fade which causes issues with detecting web element.
      await driver.executeScript(`$('#saveNoteModal').removeClass('fade');`);
    })
    
    it('should pass rescue note cancel', async function() {
      let titleText = 'This is a test title.';
      let bodyText = 'This is some test body text.';
      
      // Get note object count before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      let countBefore = Object.keys(decDB.notes).length;
      
      // Insert new text into note title and body.
      let noteTitle = await body.findElement(By.id('noteTitle'));
      let noteBody = await body.findElement(By.id('noteBody'));
      await noteTitle.sendKeys(titleText);
      await noteBody.sendKeys(bodyText);
      
      // Click on a new note without saving current note.
      await driver.executeScript('$(document).scrollLeft(0);');  // Ensure save button is in view and clickable.
      let createNoteButton = await body.findElement(By.id('createNote'));
      await createNoteButton.click();
      
      // Click 'cancel' button on note rescue modal.
      let saveNoteCancel = await body.findElement(By.id('saveNoteCancel'));
      await saveNoteCancel.click();
      
      // Assert rescue note modal disappears, no new note is saved and title/body remain in the note window.
      await driver.wait(until.elementIsNotVisible(saveNoteCancel), timeout);
      assert.equal(await noteTitle.getAttribute('value'), titleText);
      assert.equal(await noteBody.getAttribute('value'), bodyText);
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(countBefore, Object.keys(decDB.notes).length);
    })
    
    it('should pass rescue note do not save', async function() {
      let titleText = 'This is a test title.';
      let bodyText = 'This is some test body text.';
      
      // Get note object count before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      let countBefore = Object.keys(decDB.notes).length;
      
      // Insert new text into note title and body.
      let noteTitle = await body.findElement(By.id('noteTitle'));
      let noteBody = await body.findElement(By.id('noteBody'));
      await noteTitle.sendKeys(titleText);
      await noteBody.sendKeys(bodyText);
      
      // Click on a new note without saving current note.
      await driver.executeScript('$(document).scrollLeft(0);');  // Ensure save button is in view and clickable.
      let createNoteButton = await body.findElement(By.id('createNote'));
      await createNoteButton.click();
      
      // Click 'don't save' button on note rescue modal.
      let saveNoteNo = await body.findElement(By.id('saveNoteNo'));
      await saveNoteNo.click();
      
      // Assert rescue note modal disappears, no new note is saved and title/body are cleared.
      await driver.wait(until.elementIsNotVisible(saveNoteNo), timeout);
      assert.equal(await noteTitle.getAttribute('value'), '');
      assert.equal(await noteBody.getAttribute('value'), '');
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(countBefore + 1, Object.keys(decDB.notes).length);
    })
    
    it('should pass rescue note save', async function() {
      let titleText = 'This is a test title.';
      let bodyText = 'This is some test body text.';
      
      // Get note object count before test.
      let encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      let decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      let countBefore = Object.keys(decDB.notes).length;
      
      // Insert new text into note title and body.
      let noteTitle = await body.findElement(By.id('noteTitle'));
      let noteBody = await body.findElement(By.id('noteBody'));
      await noteTitle.sendKeys(titleText);
      await noteBody.sendKeys(bodyText);
      
      // Click on a new note without saving current note.
      await driver.executeScript('$(document).scrollLeft(0);');  // Ensure save button is in view and clickable.
      let createNoteButton = await body.findElement(By.id('createNote'));
      await createNoteButton.click();
      
      // Click 'save' button on note rescue modal.
      let saveNoteYes = await body.findElement(By.id('saveNoteYes'));
      await saveNoteYes.click();
      
      // Assert rescue note modal disappears, existing note is saved and title/body are cleared.
      await driver.wait(until.elementIsNotVisible(saveNoteYes), timeout);
      assert.equal(await noteTitle.getAttribute('value'), '');
      assert.equal(await noteBody.getAttribute('value'), '');
      encDB = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${testCreds.username}'))`);
      decDB = JSON.parse(dl.decrypt(encDB.db, fixtures.dek));
      assert.equal(countBefore + 2, Object.keys(decDB.notes).length);
      //let newNote = Object.entries(decDB.notes)[Object.entries(decDB.notes).length - 1][1];
    })
  });
});
