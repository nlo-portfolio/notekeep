'use strict';


/*
 * Handles trash events in the results window.
 */
$(document).ready(function() {

/* Trash */
  
  $(document).on('click', '#trash .note', function(e) {
    ; // Do nothing.
  });
  
  $(document).on('click', '#trash .folder', function(e) {
    ; // Do nothing.
  });
  
  $(document).on('click', '#trash .trashNote', function(e) {
    e.stopPropagation();
    $('#trashNoteSubmit').attr('uuid', $(this).attr('uuid'));
    $('#trashNoteModal').modal('show');
  });
  
  $(document).on('click', '#trashNoteSubmit', function(e) {
    e.preventDefault();
    let uuid = $(this).attr('uuid');
    let note = new Note(uuid, window.db.trash);
    note.trash();
    refreshResults(window.db.trash, true);
    toastr.success('Note permanently deleted.');
    $('#trashNoteModal').modal('hide');
  });
  
  $(document).on('click', '#trashNoteCancel', function(e) {
    e.preventDefault();
    $('#trashNoteModal').modal('hide');
  });
  
  $(document).on('click', '#trash .restoreNote', function(e) {
    e.stopPropagation();
    let uuid = $(this).attr('uuid');
    let note = new Note(uuid, window.db.trash);
    note.restore();
    refreshResults(window.db.trash, true);
    toastr.success('Note restored.');
  });
  
  $(document).on('click', '#trash .restoreFolder', function(e) {
    e.stopPropagation();
    let uuid = $(this).attr('uuid');
    let folder = new Folder(uuid, window.db.trash);
    folder.restore();
    refreshResults(window.db.trash, true);
    toastr.success('Folder restored.');
  });
  
  $(document).on('click', '#trash .trashFolder', function(e) {
    $('#trashFolderSubmit').attr('uuid', $(this).attr('uuid'));
    $('#trashFolderModal').modal('show');
  });
  
  $(document).on('click', '#trashFolderSubmit', function(e) {
    e.preventDefault();
    let uuid = $(this).attr('uuid');
    let folder = new Folder(uuid, window.db.trash);
    folder.trash();
    refreshResults(window.db.trash, true);
    toastr.success('Folder permanently deleted.');
    $('#trashFolderModal').modal('hide');
  });
  
  $(document).on('click', '#trashFolderCancel', function(e) {
    e.preventDefault();
    $('#trashFolderModal').modal('hide');
  });
  
});

