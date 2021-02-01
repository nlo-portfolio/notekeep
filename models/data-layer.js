'use strict';


/**
 * Class used for working with cryptographic functions and local storage.
 */
class DataLayer {

  /**
   * Create new DataLayer object.
   */
  constructor() {
    let crypto;
    if(typeof CryptoJS === 'undefined') {
      crypto = require('./../test/node_modules/crypto-js/');
    } else {
      crypto = CryptoJS;
    }
   
    /**
     * Encrypt data.
     * @param  {String}  data      Data to encrypt as string.
     * @param  {String}  password  Password used for encryption.
     */
    this.encrypt = function(data, password) {
      return crypto.AES.encrypt(data, password).toString();
    }
    
    /**
     * Decrypt data.
     * @param  {String}  data      Data to decrypt as string.
     * @param  {String}  password  Password used for decryption.
     */
    this.decrypt = function(data, password) {
      let dec_stream = crypto.AES.decrypt(data, password);
      let plaintext = dec_stream.toString(crypto.enc.Utf8);
      if (plaintext) {
        return plaintext;
      } else {
        throw new Error('Malformed UTF-8 data');
      }
    }
  
    /**
     * Read data from local storage.
     */
    this.read = function() {
      let data = JSON.parse(localStorage.getItem(window.username));
      return JSON.parse(this.decrypt(data.db, window.dek));
    }
  
    /**
     * Write data to local storage.
     */
    this.write = function() {
      localStorage.setItem('db', JSON.stringify(window.db));
      window.profile.db = this.encrypt(JSON.stringify(window.db), window.dek);
      localStorage.setItem(window.username, JSON.stringify(window.profile));
    }
    
    /**
     * Generate a new PBKDF2 key.
     * @param  {String}              password  Password used for generating PBKDF2.
     * @param  {CryptoJS.WordArray}  salt      Randomized value used for salt.
     */
    this.getPBKDF2 = function(password, salt) {
      return crypto.enc.Base64.stringify(crypto.PBKDF2(password, salt, { keySize: 512 / 32, iterations: 1000 }));
    }
  }
}


// Export for use in NodeJS/Selenium tests.
try {
  module.exports = DataLayer;
} catch { ; } // Ignore error in browsers.
