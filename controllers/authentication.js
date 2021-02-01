'use strict';


/*
 * Handles authentication events.
 */
$(document).ready(function() {

  /* Login */

  $(document).on('click', '#loginSubmit', function(e) {
    e.preventDefault();
    let userProfile;
    let username = $('#loginUsername').val();
    let password = $('#loginPassword').val();
    let userData = localStorage.getItem(username);
    if(!userData) {
      $('#loginError').html('Invalid username or password');
      return;
    } else {
      window.profile = JSON.parse(userData);
    }
    
    /* Attempt to decrypt the database to authenticate user. */
    let dek;
    try {
      let kek = window.dl.getPBKDF2(password, CryptoJS.enc.Base64.parse(window.profile.salt));
      dek = window.dl.decrypt(window.profile.dek, kek);
      kek = null;  // Clear kek from memory (don't trust GC).
      password = null;  // Clear password from memory (don't trust GC).
      window.db = JSON.parse(window.dl.decrypt(window.profile.db, dek));
    } catch(error) {
      $('#loginError').html('Invalid username or password');
      return;
    }
    
    window.username = username;
    window.dek = dek;
    window.currentFolder = '';
    window.currentNote = '';
    window.noteSaved = true;
    localStorage.setItem('username', username);
    localStorage.setItem('db', JSON.stringify(window.db));
    localStorage.setItem('dek', window.dek);
    localStorage.setItem('currentFolder', '');
    localStorage.setItem('currentNote', '');
    $('body').html(mainUI);
    fitMenu();
    fitTextarea();
    refreshResults();
  });

  
  /* Logout */

  $(document).on('click', '#logoutButton', function(e) {
    e.preventDefault();
    
    if(!window.noteSaved) {
      $('#saveNoteNo').attr('redirect', window.currentNote);
      $('#saveNoteYes').attr('redirect', window.currentNote);
      $('#saveNoteModal').modal('show');
      return;
    }
    
    localStorage.setItem('db', '');
    localStorage.setItem('username', '');
    localStorage.setItem('dek', '');
    localStorage.setItem('currentFolder', '');
    localStorage.setItem('currentNote', '');
    window.db = null;
    window.dek = null;
    window.profile = null;
    window.currentFolder = null;
    window.currentNote = null;
    window.noteSaved = true;
    $('body').html(loginHTML);
    $('#loginError').html("<div id='logoutSuccess' class='text-success'>You have been logged out successfully</div>");
  });
});
