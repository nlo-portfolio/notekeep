'use strict';


/*
 * Handles events in the results window (inside left panel).
 */
$(document).ready(function() {

  /* Normal */

  $(document).on('click', '#normal .note', function(e) {
    let uuid = $(this).attr('uuid');
    if(uuid == window.currentNote)
      return;
      
    if(!window.noteSaved) {
      $('#saveNoteNo').attr('redirect', uuid);
      $('#saveNoteYes').attr('redirect', uuid);
      $('#saveNoteModal').modal('show');
      return;
    }

    window.currentNote = uuid;
    localStorage.setItem('currentNote', uuid);
    let note = new Note(uuid);
    window.view.showNote(note);
    refreshResults();
  });
    
  $(document).on('click', '#normal .folder', function(e) {
    let uuid = $(this).attr('uuid');
    window.currentFolder = uuid;
    localStorage.setItem('currentFolder', uuid);
    refreshResults();
  });
  
  $(document).on('click', '#normal .editFolder', function(e) {
    e.stopPropagation();
    let uuid = $(this).attr('uuid');
    let folder = new Folder(uuid);
    $('#editFolderSubmit').attr('uuid', uuid);
    $('#editFolderTitle').val(folder.folderData.title);
    $('#editFolderListContainer').html(window.view.getFolderList('editFolderList'));
    $('#editFolderModal').modal('show');
  });
  
  $(document).on('click', '#editFolderCancel', function(e) {
    e.preventDefault();
    $('#editFolderModal').modal('hide');
  });
  
  $(document).on('click', '#editFolderSubmit', function(e) {
    e.preventDefault();
    let folderTitle = $('#editFolderTitle').val();
    let destFolder = $('#editFolderList option:selected').val();
    let uuid = $(this).attr('uuid');
    
    let folder = new Folder(uuid);
    if(destFolder == uuid)
      folder.save(folderTitle);
    else
      folder.save(folderTitle, destFolder);
    
    $('#editFolderModal').modal('hide');
    refreshResults();
  });
  
  $(document).on('click', '#normal .deleteNote', function(e) {
    e.stopPropagation();
    let uuid = $(this).attr('uuid');
    new Note(uuid).delete();
    if(window.currentNote == uuid) {
      window.currentNote = '';
      localStorage.setItem('currentNote', '');
    }
    refreshResults();
  });
  
  $(document).on('click', '#normal .deleteFolder', function(e) {
    e.stopPropagation();
    let uuid = $(this).attr('uuid');
    new Folder(uuid).delete();
    if(window.currentFolder == uuid) {
      window.currentFolder = folder.folderData.folder;
      localStorage.setItem('currentFolder', 'folder.folderData.folder');
    }
    refreshResults();
  });
  
  $(document).on('input', '#search', function(e) {
    let text = e.target.value;
    if(!text) {
      refreshResults();
      return
    }

    let results = $('#innerResultsWindow');
    let resultsFound = false;
    results.html('');
    let noteEntries = Object.entries(window.db.notes);
    for(let entry of noteEntries) {
      if(window.currentFolder && (entry[1].folder != window.currentFolder))
        continue;
      
      if(entry[1].title.includes(text) || entry[1].body.includes(text)) {
        resultsFound = true;
        let note = new Note(entry[0]);
        console.log('Note found: ' + note.uuid);
        results.html(results.html() + note.toHTML());
      }
    }
    
    if(!resultsFound) {
      results.html('No results found.');
    }
  });
});
