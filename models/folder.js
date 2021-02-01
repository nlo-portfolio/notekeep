'use strict';


/**
 * Class used for working with Folder objects.
 */
class Folder {
  
  /**
   * Create new folder object or from existing UUID.
   * @param  {String}  uuid      UUID of folder.
   * @param  {Object}  location  Location of folder object (db/trash).
   */
  constructor(uuid = null, location = window.db) {
    if(uuid) {
      this.uuid = uuid;
      this.folderData = {
        title: location.folders[uuid].title,
        folder: location.folders[uuid].folder,
        color: location.folders[uuid].color,
        created: location.folders[uuid].created,
        modified: location.folders[uuid].modified
      }
    } else {
      do {
        this.uuid = (function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)})();
      } while(this.uuid in location.folders);
      
      this.folderData = {
        title: '',
        folder: '',
        color: '#FFFFFF',
        created: Date.now().toString(),
        modified: ''
      }
    }
  
  /**
   * Save folder data.
   * @param  {String}  title   Title of folder.
   * @param  {String}  folder  UUID of folder containing folder.
   * @param  {String}  color   Hexadecimal color code for folder.
   */
  this.save = function(title=this.folderData.title, folder=this.folderData.folder, color=this.folderData.color) {
    this.folderData = {
      title: _.unescape(title),
      folder: folder,
      color: color,
      created: this.folderData.created,
      modified: Date.now().toString()
    }
    window.db.folders[this.uuid] = this.folderData;
    window.dl.write();
    console.log(`Folder Saved: ${this.uuid}`);
  }

  /**
   * Move folder and all note contents to trash.
   */
  this.delete = function() {
    let folderEntries = Object.entries(window.db.folders);
    let noteEntries = Object.entries(window.db.notes);
    
    // Delete subfolders and all contained notes.
    (function deleteRecursively(folderEntries, noteEntries, folder) {
      for(let fEntry of folderEntries) {
        if(fEntry[1].folder == folder) {
          window.db.trash.folders[fEntry[0]] = fEntry[1];
          delete window.db.folders[fEntry[0]];
          for(let nEntry of noteEntries) {
            if(nEntry[1].folder == fEntry[0]) {
              new Note(nEntry[0]).delete();
            }
          }
          console.log(`Deleting folder: ${fEntry[0]})`);
          deleteRecursively(folderEntries, noteEntries, fEntry[0]);
        }
      }
    })(folderEntries, noteEntries, this.uuid);
    
    // Delete root folder and all notes.
    for(let entry of noteEntries) {
      if(entry[1].folder == this.uuid)
        new Note(entry[0]).delete();
    }
    this.folderData.folder = '';
    window.db.trash.folders[this.uuid] = this.folderData;
    delete window.db.folders[this.uuid];
    window.dl.write();
    console.log(`Folder Deleted: ${this.uuid})`);
  }
  
  /**
   * Restore folder and all note contents from trash.
   */
  this.restore = function() {
    let folderEntries = Object.entries(window.db.trash.folders);
    let noteEntries = Object.entries(window.db.trash.notes);
    
    // Restore subfolders and all contained notes.
    (function restoreRecursively(folderEntries, noteEntries, folder) {
      for(let fEntry of folderEntries) {
        if(fEntry[1].folder == folder) {
          window.db.folders[fEntry[0]] = fEntry[1];
          delete window.db.trash.folders[fEntry[0]];
          for(let nEntry of noteEntries) {
            if(nEntry[1].folder == fEntry[0]) {
              new Note(nEntry[0], window.db.trash).restore();
            }
          }
          console.log(`Folder Restored: ${fEntry[0]})`);
          restoreRecursively(folderEntries, noteEntries, fEntry[0]);
        }
      }
    })(folderEntries, noteEntries, this.uuid);
    
    // Restore root folder and all notes.
    for(let entry of noteEntries) {
      if(entry[1].folder == this.uuid)
        new Note(entry[0], window.db.trash).restore();
    }
    
    // Restore to original folder if it exists, otherwise make root.
    if((this.folderData.folder != '') && (!window.db.folders[this.folderData.folder])) {
      this.folderData.folder = '';
    }
    
    window.db.folders[this.uuid] = this.folderData;
    delete window.db.trash.folders[this.uuid];
    window.dl.write();
    console.log(`Folder Restored: ${this.uuid})`);
  }
  
  /**
   * Permanently delete folder and all note contents from trash.
   */
  this.trash = function() {
    let folderEntries = Object.entries(window.db.trash.folders);
    let noteEntries = Object.entries(window.db.trash.notes);
    
    // Trash subfolders and all contained notes.
    (function trashRecursively(folderEntries, noteEntries, folder) {
      for(let fEntry of folderEntries) {
        if(fEntry[1].folder == folder) {
          delete window.db.trash.folders[fEntry[0]];
          for(let nEntry of noteEntries) {
            if(nEntry[1].folder == fEntry[0]) {
              new Note(nEntry[0], window.db.trash).trash();
            }
          }
          console.log(`Folder Trashed: ${fEntry[0]})`);
          trashRecursively(folderEntries, noteEntries, fEntry[0]);
        }
      }
    })(folderEntries, noteEntries, this.uuid);
    
    // Trash root folder and all notes.
    for(let entry of noteEntries) {
      if(entry[1].folder == this.uuid)
        new Note(entry[0], window.db.trash).trash();
    }
    delete window.db.trash.folders[this.uuid];
    window.dl.write();
    console.log(`Folder Trashed: ${this.uuid})`);
  }
  
  /**
   * HTML output for folder objects.
   * @param  {Boolean}  trash  Whether folder object is in trash.
   */
  this.toHTML = function(trash = false) {
    let containerID;
    let icon;
    let css;
    let refreshIcon;
    let editIcon;
    let breadcrumbs = window.view.getBreadcrumbs(this.folderData.folder);
    let columnWidth;
    if(trash) {
      containerID = 'trash';
      icon = 'fa-undo';
      icon = 'fa-trash-restore';
      css = 'trashFolder';
      refreshIcon = `<div class='col-1'>
                      <i uuid='${this.uuid}' class='fas fa-2x ${icon} py-2 restoreFolder' title='Restore Folder'></i>
                    </div>`;
      editIcon = '';
      columnWidth = '263px';
    } else {
      containerID = 'normal';
      icon = 'fa-times';
      css = 'deleteFolder';
      refreshIcon = '';
      editIcon = `<div class='col-1'>
                    <i uuid='${this.uuid}' class='fas fa-2x fa-edit py-2 editFolder' title='Edit Folder'></i>
                  </div>`
      columnWidth = '263px';
    }

    return `
      <div id='${containerID}'>
        <div class='row py-1 m-1 rounded folder item-shadow' uuid='${this.uuid}' title='Folder Path: ${breadcrumbs}'>
            <div class='col-1'>
              <i class='fas fa-2x fa-folder py-2' title='Type: Folder'></i>
            </div>
            <div class='col lineItemDesc text-truncate' style='max-width:${columnWidth};'>
              Folder: ${_.escape(this.folderData.title)}
            </div>
            ${refreshIcon}
            ${editIcon}
            <i uuid='${this.uuid}' class='fas fa-2x fa-times py-2 pl-4 ${css}' title='Delete Folder'></i>
          
        </div>
      </div>
    `
  }
  }
}
