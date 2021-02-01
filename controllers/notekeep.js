'use strict';


/**
 * Main entrypoint for application. Loads the main interface if logged in
 * or the login page if logged out.
 */
$(document).ready(function() {

  /* Setup page and script */
  
  window.username = localStorage.getItem('username');
  window.dek = localStorage.getItem('dek');
  window.dl = new DataLayer();
  window.view = new View();
  try {
    window.db = JSON.parse(localStorage.getItem('db'));
    window.profile = JSON.parse(localStorage.getItem(window.username));
  } catch(error) {
    ;
  }
  
  if(window.username && window.db) {
    window.currentNote = localStorage.getItem('currentNote');
    window.currentFolder = localStorage.getItem('currentFolder');
    window.noteSaved = true;
    
    try {
      new Note(window.currentNote);
    } catch {
      window.currentNote = '';
      localStorage.setItem('currentNote', '');
    }
    
    try {
      new Folder(window.currentFolder);
    } catch {
      window.currentFolder = '';
      localStorage.setItem('currentFolder', '');
    }      

    $('body').html(mainUI());
    window.view.showNote(new Note(window.currentNote));
    refreshResults();
  } else {
    $('body').html(loginHTML);
  }

  fitMenu();
  fitTextarea();
});


$(window).resize(function() {
  fitMenu();
  fitTextarea();
});
  
function fitMenu() {
    let headerHeight = $('#header').height();
    let panelHeight = $('#menuWindow').height();
    let navbarContainerHeight = $('#navbar-container').height();
    $('#navbar-container').height(panelHeight - headerHeight - 8);
    
    let searchRowHeight = $('#searchRow').height();
    $('#innerResultsWindow').height(panelHeight - headerHeight - searchRowHeight - 40);
}
  
function fitTextarea() {
    let height = $('#noteWindow').height() - $('#noteTitle').outerHeight(true) - $('#noteInfoRow').outerHeight(true);
    $('#noteBody').height(height - 25);
}
