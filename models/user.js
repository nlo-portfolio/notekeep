'use strict';


/**
 * Class used for working with User objects.
 */
class User {
  
  /**
   * Create new user object or from existing UUID.
   * @param  {String}  username  Username to retrieve.
   */
  constructor(username) {
    this.username = username;
    if(typeof CryptoJS === 'undefined') {
      CryptoJS = require('./../test/node_modules/crypto-js/crypto-js.js');
    }
  
  /**
   * Create a new user.
   * @param  {String}  newUsername   New username value.
   * @param  {String}  newPassword1  New password value.
   * @param  {String}  newPassword2  Confirm new password value.
   */
  this.create = function(newUsername, newPassword1, newPassword2) {
    if(newUsername.length == 0) {
      return 'Username cannot be blank';
    } else if(localStorage.getItem(newUsername)) {
      return 'Username unavailable';
    } else if((newPassword1.length == 0) || (newPassword2.length == 0)) {
      return 'Passwords cannot be blank';
    } else if(newPassword1 != newPassword2) {
      return 'Passwords do not match';
    }
    
    let salt = CryptoJS.lib.WordArray.random(128/8);
    let kek = window.dl.getPBKDF2(newPassword1, salt);
    let dek = CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(512/8));
    let encDEK = window.dl.encrypt(dek, kek);
    kek = null;         // Clear kek from memory (don't trust GC).
    newPassword1 = null;  // Clear password1 from memory (don't trust GC).
    newPassword2 = null;  // Clear password2 from memory (don't trust GC).
    
    let db = { 'notes': {},
               'folders': {},
               'trash': {
                 'folders': {},
                 'notes': {}
               }
             };
    let newProfile = { 
                       db: window.dl.encrypt(JSON.stringify(db), dek),
                       salt: CryptoJS.enc.Base64.stringify(salt),
                       dek: encDEK
                     };
    window.username = newUsername;
    window.profile = newProfile;
    window.db = db;
    window.currentFolder = '';
    window.currentNote = '';
    window.noteSaved = true;
    window.dek = dek;
    
    localStorage.setItem([newUsername], JSON.stringify(newProfile));
    localStorage.setItem('username', window.username);
    localStorage.setItem('dek', window.dek);
    
    localStorage.setItem('db', JSON.stringify(window.db));
    localStorage.setItem('currentFolder', window.currentFolder);
    localStorage.setItem('currentNote', window.currentNote);
  }
  
  /**
   * Change the user password.
   * @param  {String}  currentPassword  Current password value.
   * @param  {String}  newPassword1     New password value.
   * @param  {String}  newPassword2     Confirm new password value.
   */
  this.changePassword = function(currentPassword, newPassword1, newPassword2) {
    if(currentPassword == '' || newPassword1 == '' || newPassword2 == '') {
      return 'Passwords cannot be blank';
    }
    
    if(newPassword1 != newPassword2) {
      return 'New passwords do not match';
    }
    
    try {
      let oldKEK = window.dl.getPBKDF2(currentPassword, CryptoJS.enc.Base64.parse(window.profile.salt));
      let decOldDEK = window.dl.decrypt(JSON.parse(localStorage.getItem(this.username)).dek, oldKEK);
      if(decOldDEK != window.dek)
        throw new Error();
    } catch(error) {
      return 'Current password is invalid';
    }
    
    let newSalt = CryptoJS.lib.WordArray.random(128/8);
    let newKEK = window.dl.getPBKDF2(newPassword1, newSalt);
    let encNewDEK = window.dl.encrypt(window.dek, newKEK);
    window.profile.salt = CryptoJS.enc.Base64.stringify(newSalt);
    window.profile.dek = encNewDEK;
    window.profile.db = window.dl.encrypt(JSON.stringify(window.dl.read()), window.dek);
    localStorage.setItem(window.username, JSON.stringify(window.profile));
    newKEK = null;  // Don't trust GC.
    console.log(`Password for ${this.username} changed.`);
  }

  /**
   * Export the user database.
   * @param  {String}  exportFormat  Specify plaintext or ciphertext format.
   */
  this.exportDB = function(exportFormat) {
    let data;
    let ext;
    if(exportFormat == 'plaintext') {
      let profile = JSON.parse(localStorage.getItem(this.username));
      profile.db = window.dl.decrypt(profile.db, window.dek);
      data = new Blob([JSON.stringify(profile)], {type: 'application/json'});
      ext = '';
    } else {
      data = new Blob([localStorage.getItem(this.username)], {type: 'application/octet-stream'});
      ext = '.enc';      
    }
    let url = window.URL.createObjectURL(data);
    saveAs(data, `${this.username}-db-backup.json${ext}`);
    window.URL.revokeObjectURL(url);
  }
  
  /**
   * Import the user database.
   * @param  {String}  input  Data to be imported as string.
   */
  this.importDB = function(input) {
    let result = this.importDBPlaintext(input);
    if(result) {
      console.log('Database (plaintext) imported successfully.');
      return true;
    }
    
    result = this.importDBCiphertext(input);
    if(result) {
      console.log('Database (ciphertext) import successfully.');
      return true;
    } else {
      console.log('Database (ciphertext) import failed.');
      return false;
    }
  }
  
  /**
   * Checks to ensure plaintext data is valid and overwrites the current database.
   * @param  {String}  input  Data to be imported as string.
   */
  this.importDBPlaintext = function(input) {
    let decProfile;
    try {
      decProfile = JSON.parse(input);
    } catch(e) {
      console.log('Invalid JSON format.');
      return false; 
    }
    
    if(decProfile.db == null ||
       decProfile.salt == null ||
       decProfile.dek == null /*||
       decProfile.db.notes == null ||
       decProfile.db.folders == null ||
       decProfile.db.trash == null */) {
      console.log('Invalid database format.');
      return false;
    }
    
    try {
      let encProfile = {
        db: window.dl.encrypt(decProfile.db, window.dek),
        salt: decProfile.salt,
        dek: decProfile.dek
      };
      localStorage.setItem(this.username, JSON.stringify(encProfile));
      localStorage.setItem('db', decProfile.db);
      window.db = JSON.parse(decProfile.db);
      return true;
    } catch(error) {
      console.log('Import plaintext error: ' + error);
      return false;
    }
  }
  
  /**
   * Checks to ensure ciphertext data is valid and overwrites the current database.
   * @param  {String}  input  Data to be imported as string.
   */
  this.importDBCiphertext = function(input) {
    let profile;
    try {
      profile = JSON.parse(input);
    } catch(e) {
      console.log('Invalid JSON format.');
    }
    
    if(profile.db == null ||
       profile.salt == null ||
       profile.dek == null) {
      console.log('Invalid database format.');
      return false;
    }
    
    try {
      let decDB = JSON.parse(window.dl.decrypt(profile.db, window.dek));
      let currentProfile = JSON.parse(localStorage.getItem(window.username));
      profile.salt = currentProfile.salt;
      profile.dek = currentProfile.dek;
      localStorage.setItem(this.username, JSON.stringify(profile));
      window.db = decDB;
      localStorage.setItem('db', JSON.stringify(decDB));
      return true;
    } catch(error) {
      console.log('Import ciphertext error: ' + error);
      return false;
    }
  }
  
  /**
   * Import the user database.
   * @param  {Jquery.Event}  event  Contains event and file data.
   */
  this.getImportDB = async function(event) {
    function getInput(file) {
      return new Promise((resolve, reject) => {
        let fr = new FileReader();  
        fr.onload = () => {
          resolve(fr.result)
        };
        fr.onerror = reject;
        fr.readAsText(file);
      });
    }
  
    let file = event.target.files[0];
    return getInput(file).
    then(input => { return input; }).
    catch(error => { console.log(error); return null; });
  }
}
}
