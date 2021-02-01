'use strict';


/*
 * Handles navigation events.
 */
$(document).ready(function() {

  /* Navigation */

  $(document).on('click', '#backArrow', function(e) {
    let parent = new Folder(window.currentFolder).folderData.folder;
    localStorage.setItem('currentFolder', parent);
    window.currentFolder = parent;
    refreshResults();
  });
  
  $(document).on('click', '#createNote', function(e) {
    if(!window.noteSaved) {
      $('#saveNoteNo').attr('redirect', '');
      $('#saveNoteYes').attr('redirect', '');
      $('#saveNoteModal').modal('show');
      return;
    }
    
    // Reset note window.
    $('#noteTitle').val('');
    $('#noteBody').val('');
    $('#folderListContainer').html(window.view.getFolderList());
  
    let note = new Note();
    note.save();
    window.currentNote = note.uuid;
    localStorage.setItem('currentNote', note.uuid);
    refreshResults();
  });
  
  $(document).on('click', '#createFolder', function(e) {
    $('#createFolderModal').modal('show');
  });
  
  $(document).on('click', '#createFolderCancel', function(e) {
    e.preventDefault();
    $('#newFolderTitle').val('');
    $('#createFolderModal').modal('hide');
  });
  
  $(document).on('click', '#createFolderSubmit', function(e) {
    e.preventDefault();
    let folderTitle = $('#newFolderTitle').val();
    let folder = new Folder();
    folder.save(folderTitle, window.currentFolder);
    window.currentFolder = folder.uuid;
    localStorage.setItem('currentFolder', folder.uuid);
    $('#createFolderModal').modal('hide');
    $('#newFolderTitle').val('');
    refreshResults();
  });
  
  $(document).on('click', '#saveNote', function(e) {
    let note = new Note(window.currentNote);
    note.save();
    window.currentNote = note.uuid;
    localStorage.setItem('currentNote', note.uuid);
    refreshResults();
    
    let date = new Date(parseInt(note.noteData.modified));
    let lastSaved = window.view.formatDate(date);
    $('#lastSavedMessage').html(`Last Saved: ${lastSaved}`);
    window.noteSaved = true;
    toastr.success('Note saved');
  });
  
  $(document).on('click', '#showTrash', function(e) {
    window.currentFolder = '';
    localStorage.setItem('currentFolder', '');
    refreshResults(window.db.trash, true);
  });
  
  $(document).on('change', '#folderList', function(e) {
    e.stopImmediatePropagation();
    window.stopprop = true;
    let uuid = $('#folderList option:selected').val();
    $(`#folderList option[value="${uuid}"`).html(window.view.getBreadcrumbs(uuid));
  });
  
  $(document).on('click', '#folderList', function(e) {
    if(!window.stopprop) {
      $('#folderList').html(window.view.getFolderList());
    }
    window.stopprop = false;
    delete window.stopprop;
  });
});
