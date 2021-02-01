'use strict';

  
/**
 * GLOBAL: Updates the results window with note and folder objects.
 * @param  {Object}   location  Location to display (db/trash).
 * @param  {Boolean}  trash     Indicates trash objects.
 */ 
function refreshResults(location=window.db, trash=false) {
  let folderEntries = Object.entries(location.folders);
  let noteEntries = Object.entries(location.notes);
  let htmlOutput = '';

  for(let entry of folderEntries) {
    if(entry[1].folder == window.currentFolder) {
      let folder = new Folder(entry[0], location);
      htmlOutput = htmlOutput + folder.toHTML(trash);
    }
  }
    
  for(let entry of noteEntries) {
    if(entry[1].folder == window.currentFolder) {
      let note = new Note(entry[0], location);
      htmlOutput = htmlOutput + note.toHTML(trash);
    }
  }
  
  if(!htmlOutput) { htmlOutput = "<div class='row'><div class='col-12 text-center'>No Items</div></div>"; }
  $('#innerResultsWindow').html(htmlOutput);
  if (window.currentFolder) { $('#backArrow').prop('disabled', false); }
}


/**
 * Views modules for UI related tasks.
 */
function View() {

  /**
   * Generate dropdown element for folder selection.
   * @param  {String}  id  Type of dropdown to display.
   */
  this.getFolderList = function(id='folderList') {
    // remove
    if(!window.db.folders)
      return '';
    
    let entries = Object.entries(window.db.folders);
    let output = function recurse(entries, folder='', output=`<select id='${id}' name='${id}' class='dropDown'><option class='option' value="">&lt;root&gt;</option>`, spacing=0) {
      for(let entry of entries) {
        if(entry[1].folder == folder) {
          let prefix = spacing == 0 ? '' : '\u2514\u2500&nbsp;';
          let selected = window.currentFolder == entry[0] ? " selected='selected'" : '';
          output = `${output}<option class='option' value='${entry[0]}'${selected}>${(Array(spacing).join('&emsp;'))}${prefix}${_.escape(entry[1].title)}</option>`;
          output = recurse(entries, entry[0], output, spacing+2);
        }
      }
      return output;
    }(entries);
    return output + '</select>';
  }
  
  /*
   * Formats a Date object.
   * @param   {Date}    date  Date object to format.
   * @return  {String}        String representation of Date object.
   */
  this.formatDate = function(date) {
    let dateFormat = date.toLocaleString(
      'en-US', ({
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    )
    let timeFormat = date.toLocaleString(
      'en-US', ({
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZoneName: 'short'
      })
    )
    return dateFormat + ' @ ' + timeFormat;
  }
  
  /**
   * Populates the note window with data from a note object.
   * @param  {Note}  note  Note object to display.
   */
  this.showNote = function(note) {
    // remove
    if(Object.keys(note) == 0) {
      return;
    }
  
    $('#noteTitle').val(_.escape(note.noteData.title));
    $('#noteBody').val(_.escape(note.noteData.body));
    $('#folderList option:selected').html(this.getBreadcrumbs(note.noteData.folder));
    
    let lastSaved = this.formatDate(new Date(parseInt(note.noteData.modified)));
    $('#lastSavedMessage').html(`Saved: ${lastSaved}`);
  }
  
  /**
   * Generate breadcrumbs for a given folder path.
   * @param  {String}  folder  Folder UUID tail.
   * @param  {String}  sep     Separator for breadcrumbs trail.
   */
  this.getBreadcrumbs = function(folder='', sep='>') {
    if(!folder)
      return '&lt;root&gt;';
  
    let crumbs = function recurse(folder, sep, output='') {
      let current = window.db.folders[folder];
      if(current.folder == '') {
        return _.escape(current.title) + ' ' + sep + ' ' + output;
      } else {
        output = _.escape(current.title) + ' ' + sep + ' ' + output;
        return recurse(current.folder, sep, output);
      }
    }(folder, sep);
    return crumbs;
  }
  
  /**
   * Clears the change password form inputs after closing.
   */
  this.clearChangePasswordInputs = function() {
    $('#currentPassword').val('');
    $('#newPassword1').val('');
    $('#newPassword2').val('');
  }
}
