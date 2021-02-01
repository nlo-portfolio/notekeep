'use strict';


/**
 * Class used for working with Note objects.
 */
class Note {
  
  /**
   * Create new note object or from existing UUID.
   * @param  {String}  uuid      UUID of note.
   * @param  {Object}  location  Location of note object (db/trash).
   */
  constructor(uuid = null, location = window.db) {
    if(uuid) {
      this.uuid = uuid;
      this.noteData = {
        title: location.notes[uuid].title,
        body: location.notes[uuid].body,
        folder: location.notes[uuid].folder,
        tags: location.notes[uuid].tags,
        color: location.notes[uuid].color,
        created: location.notes[uuid].created,
        modified: location.notes[uuid].modified
      };
    } else {
      this.uuid ='';
      do {
        this.uuid = (function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)})();
      } while(this.uuid in location.notes);
      
      this.noteData = {
        title: '',
        body: '',
        folder: window.currentFolder,
        tags: [],
        color: '#FFFFFF',
        created: Date.now().toString(),
        modified: Date.now().toString()
      };
    }
  
  /**
   * Save note data to local storage.
   */
  this.save = function() {
    this.noteData.title = _.unescape($('#noteTitle').val());
    this.noteData.body = _.unescape($('#noteBody').val());
    this.noteData.folder = _.unescape($('#folderList option:selected').val());
    this.noteData.modified = Date.now().toString();
    window.db.notes[this.uuid] = this.noteData;
    window.dl.write();
    console.log(`Note Saved: ${this.uuid}`);
  }

  /**
   * Move note to trash.
   */
  this.delete = function() {
    window.db.trash.notes[this.uuid] = this.noteData;
    delete window.db.notes[this.uuid];
    window.dl.write();
    console.log(`Note Deleted: ${this.uuid}`);
  }
  
  /**
   * Restore note from trash.
   */
  this.restore = function() {
    if(this.uuid in window.db.notes) {
      console.log('Duplicate UUID');
    }
    
    if(!(this.noteData.folder in window.db.folders))
      this.noteData.folder = '';
    window.db.notes[this.uuid] = this.noteData;
    delete window.db.trash.notes[this.uuid];
    window.dl.write();
    console.log(`Note Restored: ${this.uuid}`);
  }
  
  /**
   * Permanently delete note from trash.
   */
  this.trash = function() {
    delete window.db.trash.notes[this.uuid];
    window.dl.write();
    console.log(`Note Trashed: ${this.uuid}`);
  }
  
  /**
   * HTML output of note objects.
   * @param  {Boolean}  trash  Whether note object is in trash.
   */
  this.toHTML = function(trash = false) {
    let active;
    let containerID;
    let icon;
    let css;
    let refreshIcon;
    let columnWidth;
    if(trash) {
      containerID = 'trash';
      icon = 'fa-undo';
      icon = 'fa-trash-restore';
      css = 'trashNote';
      refreshIcon = `<div class='col-md-1'>
                      <i uuid='${this.uuid}' class='fas fa-2x ${icon} py-2 restoreNote' title='Restore Note'></i>
                    </div>`;
      columnWidth = '263px';
    } else {
      containerID = 'normal';
      icon = 'fa-times';
      css = 'deleteNote';
      refreshIcon = '';
      columnWidth = '295px';
    }
    
    if(window.currentNote == this.uuid) {
      active = 'active-border';
    } else {
      active = '';
    }
    
    return `
      <div id='${containerID}'>
        <div class='row py-1 m-1 rounded note item-shadow ${active}' uuid='${this.uuid}'>
            <div class='col-1'>
              <i class='fas fa-2x fa-sticky-note py-2' title='Type: Note'></i>
            </div>
            <div class='col lineItemDesc text-truncate' style='max-width:${columnWidth};'>
              Title: ${_.escape(this.noteData.title)}<br>
              Body: ${_.escape(this.noteData.body.slice(0, 64))}
            </div>
            ${refreshIcon}
            <i uuid='${this.uuid}' class='fas fa-2x fa-times py-2 pl-4 ${css}' title='Delete Note'></i>
        </div>
      </div>
    `
  }
  }
}
