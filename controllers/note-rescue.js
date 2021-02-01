'use strict';


/*
 * Handles prompts to the user for unsaved notes.
 */
$(document).ready(function() {

  // Check for changes in note data in order to offer data save to user.
  if(window.noteSaved) {
    $(document).on('change', '#noteBody', function(e) {
      window.noteSaved = false;
    });
    
    $(document).on('change', '#noteTitle', function(e) {
      window.noteSaved = false;
    });
    
    $(document).on('change', '#folderList', function(e) {
      window.noteSaved = false;
    });
  }
  
  $(document).on('click', '#saveNoteYes', function(e) {
    e.preventDefault();
    window.noteSaved = true;
    let redirectUUID = $(this).attr('redirect');
    new Note(window.currentNote).save();
    
    // Duplicate code in navigation.
    $('#noteTitle').val('');
    $('#noteBody').val('');
    $('#folderListContainer').html(window.view.getFolderList());

    let note = new Note(redirectUUID);
    note.save();
    window.currentNode = note.uuid;
    localStorage.setItem('currentNote', note.uuid);
    window.view.showNote(note);
    refreshResults();
    $('#saveNoteModal').modal('hide');
    toastr.success('Note saved');
  });
  
  $(document).on('click', '#saveNoteNo', function(e) {
    e.preventDefault();
    window.noteSaved = true;
    let redirectUUID = $(this).attr('redirect');
    
    // Duplicate code in navigation.
    $('#noteTitle').val('');
    $('#noteBody').val('');
    $('#folderListContainer').html(window.view.getFolderList());
    
    let note = new Note(redirectUUID);
    note.save();
    window.currentNote = redirectUUID;
    localStorage.setItem('currentNote', redirectUUID);
    window.view.showNote(note);
    refreshResults();
    $('#saveNoteModal').modal('hide');
  });
  
  $(document).on('click', '#saveNoteCancel', function(e) {
    e.preventDefault();
    $('#saveNoteModal').modal('hide');
  });
});
