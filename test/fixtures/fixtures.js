const { Builder } = require('selenium-webdriver');
let DataLayer = require('./../../models/data-layer.js');
let dl = new DataLayer();


/* Global test fixture variables. */

let CryptoJS = require('./../node_modules/crypto-js/crypto-js.js');

testCreds = {
  username: 'test_user',
  password: 'password'
}


/* Database Fixtures. */

fixtures = {};

fixtures.dek = '3TWC4CfQB5jJdpOQ7TtT7N9AbtZ3Jl2E8NCYCI69GbDc1JvDsAlomtigoS1KD0EFArxEMygBidnfjiUSI6cjcA==';

fixtures.dbEmpty = { 
    notes: {},
    folders: {},
    trash: {
             folders: {},
             notes: {}
    }
};

fixtures.dbPopulated = {
    notes: {
              "e7783f7c-bc85-4483-8ba3-92c4726bc972": {
                                                       "title":"Test Note 1-1-1",
                                                       "body":"Test Body 1-1-1",
                                                       "folder":"108b750f-ae02-494d-96b4-fe1efdfd006e",
                                                       "tags":[],
                                                       "color":"#FFFFFF",
                                                       "created":"1622597522231",
                                                       "modified":"1622597567856"
                                                      },
              "d39701cd-a0f2-4cec-8786-4b81e20e2c15": {
                                                       "title":"Test Note 1-1",
                                                       "body":"Test Body 1-1",
                                                       "folder":"a7fd4401-0413-4707-9f99-b87939037e8b",
                                                       "tags":[],
                                                       "color":"#FFFFFF",
                                                       "created":"1622597569641",
                                                       "modified":"1622597585716"
                                                     },
              "55339311-a95b-4d54-992e-b562997ee476": { 
                                                       "title":"Test Note 1-2",
                                                       "body":"Test Body 1-2",
                                                       "folder":"a7fd4401-0413-4707-9f99-b87939037e8b",
                                                       "tags":[],
                                                       "color":"#FFFFFF",
                                                       "created":"1622597592976",
                                                       "modified":"1622597605131"
                                                     },
              "90324e62-747f-4402-bbed-a1271f61a424": {
                                                       "title":"Test Note 1",
                                                       "body":"Test Body 1",
                                                       "folder":"","tags":[],
                                                       "color":"#FFFFFF",
                                                       "created":"1622597608367",
                                                       "modified":"1622597615877"
                                                     },
              "61894d5d-2dd7-4cd7-99e9-ba53b81f3e51": {
                                                       "title":"Test Note 2",
                                                       "body":"Test Body 2",
                                                       "folder":"",
                                                       "tags":[],
                                                       "color":"#FFFFFF",
                                                       "created":"1622597616683",
                                                       "modified":"1622597636419"
                                                     }
    },
    "folders":{
                  "a7fd4401-0413-4707-9f99-b87939037e8b": {
                                                            "title":"Test Folder 1",
                                                            "folder":"",
                                                            "color":"#FFFFFF",
                                                            "created":"1622597458024",
                                                            "modified":"1622597458024"
                                                          },
                  "ce19d292-ee8d-47aa-91fa-912bd64b85b0":
                                                          {
                                                            "title":"Test Folder 2",
                                                            "folder":"",
                                                            "color":"#FFFFFF",
                                                            "created":"1622597473168",
                                                            "modified":"1622597473168"
                                                          },
                  "108b750f-ae02-494d-96b4-fe1efdfd006e": {
                                                            "title":"Test Folder 1-1",
                                                            "folder":"a7fd4401-0413-4707-9f99-b87939037e8b",
                                                            "color":"#FFFFFF",
                                                            "created":"1622597483244",
                                                            "modified":"1622597483245"},
                  "3a0f9dc9-3c94-4e8e-9f76-5f77efccadbb": {
                                                            "title":"Test Folder 1-2",
                                                            "folder":"a7fd4401-0413-4707-9f99-b87939037e8b",
                                                            "color":"#FFFFFF",
                                                            "created":"1622597494035",
                                                            "modified":"1622597494035"
                                                          },
                  "b85ecb0a-5398-4189-afd5-9fc1d226d84f": {
                                                            "title":"Test Folder 1-1-1",
                                                            "folder":"108b750f-ae02-494d-96b4-fe1efdfd006e",
                                                            "color":"#FFFFFF",
                                                            "created":"1622597508144",
                                                            "modified":"1622597508146"
                                                          }
    },
    "trash": {
               "folders": {
                            "97d9531e-4fd3-4adb-a598-aa9bdf01053a": {
                                                                      "title":"Trash Folder 1",
                                                                      "folder":"",
                                                                      "color":"#FFFFFF",
                                                                      "created":"1622598163868",
                                                                      "modified":"1622598163868"
                                                                    }
               },
               "notes": {
                            "80b7b1d4b670-a9d7-44c3-c4d5-9e832056": {
                                                                      "title":"Trash Note 0-1",
                                                                      "body":"",
                                                                      "folder":"",
                                                                      "tags":[],
                                                                      "color":"#FFFFFF",
                                                                      "created":"1622597515609",
                                                                      "modified":"1622597515609"
                                                                    },
                            "dd400d38a15f-be03-4ab6-f153-68b4a633": {
                                                                      "title":"Trash Note 0-2",
                                                                      "body":"Trash Body 1",
                                                                      "folder":"97d9531e-4fd3-4adb-a598-aa9bdf01053a",
                                                                      "tags":[],
                                                                      "color":"#FFFFFF",
                                                                      "created":"1622598166082",
                                                                      "modified":"1622598184503"
                                                                    },
                            "9e832056-c4d5-44c3-a9d7-80b7b1d4b670": {
                                                                      "title":"Trash Note 1-1",
                                                                      "body":"",
                                                                      "folder":"b85ecb0a-5398-4189-afd5-9fc1d226d84f",
                                                                      "tags":[],
                                                                      "color":"#FFFFFF",
                                                                      "created":"1622597515609",
                                                                      "modified":"1622597515609"
                                                                    },
                            "68b4a633-f153-4ab6-be03-dd400d38a15f": {
                                                                      "title":"Trash Note 1-2",
                                                                      "body":"Trash Body 1",
                                                                      "folder":"97d9531e-4fd3-4adb-a598-aa9bdf01053a",
                                                                      "tags":[],
                                                                      "color":"#FFFFFF",
                                                                      "created":"1622598166082",
                                                                      "modified":"1622598184503"
                                                                    }
               }
    }
};

fixtures.encDBEmpty = {
    db: null, // get db() { let temp = fixtures.dbEmpty; return dl.encrypt(JSON.stringify(temp), this.salt); },  // db: "U2FsdGVkX19kfSvuQTWffxXBrxXpLNfanKqeFz/T8OgjDfNexA0nRjnvMeEfic55pp3GuhyxbvniB3eNfXcAxenMb/Unc7MVNtcJs5DotH8=",
    salt: "xZpnmgaonM58Te5lFA1++A==",
    dek: "U2FsdGVkX1/Ntb1l2i8YaJ3EFqDUQg3dNhcFvN7Gw1Iye+exo565pVop2rR9NuS9GAJuDAw5jOWBvL/UXXnM662WyhVFW4qlOEOFaYIFp4ds/VM8CQ+97TFAQU6iB+vf3knsMGxmXg28bzFLfWctaA=="
};

fixtures.encDBPopulated = {
    db: null, // get db() { let temp = fixtures.dbPopulated; return dl.encrypt(JSON.stringify(temp), this.salt); },  // db: "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",
    salt: "xZpnmgaonM58Te5lFA1++A==",
    dek: "U2FsdGVkX1/Ntb1l2i8YaJ3EFqDUQg3dNhcFvN7Gw1Iye+exo565pVop2rR9NuS9GAJuDAw5jOWBvL/UXXnM662WyhVFW4qlOEOFaYIFp4ds/VM8CQ+97TFAQU6iB+vf3knsMGxmXg28bzFLfWctaA=="
};

fixtures.decDBEmpty = {
    db: JSON.stringify(fixtures.dbEmpty),
    salt: "xZpnmgaonM58Te5lFA1++A==",
    dek: "U2FsdGVkX1/Ntb1l2i8YaJ3EFqDUQg3dNhcFvN7Gw1Iye+exo565pVop2rR9NuS9GAJuDAw5jOWBvL/UXXnM662WyhVFW4qlOEOFaYIFp4ds/VM8CQ+97TFAQU6iB+vf3knsMGxmXg28bzFLfWctaA=="
};

fixtures.decDBPopulated = {
    db: JSON.stringify(fixtures.dbPopulated),
    salt: "xZpnmgaonM58Te5lFA1++A==",
    dek: "U2FsdGVkX1/Ntb1l2i8YaJ3EFqDUQg3dNhcFvN7Gw1Iye+exo565pVop2rR9NuS9GAJuDAw5jOWBvL/UXXnM662WyhVFW4qlOEOFaYIFp4ds/VM8CQ+97TFAQU6iB+vf3knsMGxmXg28bzFLfWctaA=="
};

let temp = {
  get dbEmpty() { return dl.encrypt(JSON.stringify(fixtures.dbEmpty), fixtures.dek); },
  get dbPopulated() { return dl.encrypt(JSON.stringify(fixtures.dbPopulated), fixtures.dek); }
};

fixtures.encDBEmpty.db = temp.dbEmpty;
fixtures.encDBPopulated.db = temp.dbPopulated;

fixtures.invalidProfile = {};
fixtures.invalidDBPlaintext = { db: {}, salt: fixtures.salt, dek: fixtures.dek };
fixtures.invalidDBCiphertext = {
  db: dl.encrypt(JSON.stringify({}),
  fixtures.dek),
  salt: fixtures.salt,
  dek: fixtures.dek
};


/* Browsers. */
browsers = {};
browsers.firefox = function() {
  const firefox = require('selenium-webdriver/firefox');
  const options = new firefox.Options();
  options.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/json application/octet-stream');
  options.setPreference('browser.download.folderList', 2)
  options.setPreference('browser.download.dir', __dirname.slice(0, __dirname.lastIndexOf('/')) + '/temp');
  options.headless();
  return new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
}

browsers.chrome = function() {
  const chrome = require('selenium-webdriver/chrome');
  const options = new chrome.Options();
  options.headless();
  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}
