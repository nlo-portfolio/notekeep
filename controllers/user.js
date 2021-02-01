'use strict';


/*
 * Handles user events including change password, import, and export.
 */
$(document).ready(function() {

  /* Change password. */
  
  $(document).on('click', '#changePassword', function(e) {
    $('#changePasswordModal').modal('show');    
  });
  
  $(document).on('click', '#changePasswordSubmit', function(e) {
    let currentPassword = $('#currentPassword').val();
    let newPassword1 = $('#newPassword1').val();
    let newPassword2 = $('#newPassword2').val();
    let user = new User(window.username);
    let errors = user.changePassword(currentPassword, newPassword1, newPassword2);
    if(errors) {
      $('#changePasswordError').html(errors);
    } else {
      $('#changePasswordModal').modal('hide'); 
      toastr.success('Password changed successfully.');
    }
    window.view.clearChangePasswordInputs();
  });
  
  $(document).on('click', '#changePasswordCancel', function(e) {
    $('#changePasswordModal').modal('hide');
    window.view.clearChangePasswordInputs();
  });


  /* New User */
  
  //$('#createUserLink').on('click', function(e) {
  $(document).on('click', '#createUserLink', function(e) {
    e.preventDefault();
    $('body').html(createUserForm);
    //window.location.href = "createUser";
  });
  
  $(document).on('click', '#createUserSubmit', function(e) {
    e.preventDefault();
    let newUsername = $('#newUsername').val();
    let newPassword1 = $('#newPassword1').val();
    let newPassword2 = $('#newPassword2').val();
    
    let user = new User();
    let errors = user.create(newUsername, newPassword1, newPassword2);
    if(errors) {
      $('#createUserError').html(errors);
    } else {
      $('body').html(mainUI);
      fitMenu();
      fitTextarea();
    }
  });

  
  /* Import / Export */
  
  $(document).on('click', '#exportDBSubmit', function(e) {
    e.preventDefault();
    let exportFormat = $("input:radio[name='exportDBFormat']:checked").val();
    if(exportFormat == null) {
      $('#exportDBError').html('You must select a format.');
      return;
    }
    $('#exportDBModal').modal('hide');
  
    let user = new User(window.username);
    user.exportDB(exportFormat);
    toastr.success('Database exported successfully.');
  });
  
  $(document).on('click', '#exportDBCancel', function(e) {
    e.preventDefault();
    $('#exportDBModal').modal('hide');
  });
  
  $(document).on('click', '#exportDB', function(e) {
    $('#exportDBModal').modal('show');
  });
  
  $(document).on('click', '#importDBSubmit', function(e) {
    e.preventDefault();
    let user = new User(window.username);
    let input = localStorage.getItem('importDB');
    let result = user.importDB(input);
    if(result) {
      refreshResults();
      toastr.success('Database imported successfully.');
    } else {
      toastr.error('Database could not be imported.');
    }
    $('#importDBModal').modal('hide');
    localStorage.removeItem('importDB');
  });
  
  $(document).on('click', '#importDBCancel', function(e) {
    e.preventDefault();
    $('#importDBModal').modal('hide');
    localStorage.removeItem('importDB');
  });
  
  $(document).on('change', '#importDBFile', async function(e) {
    let user = new User(window.username);
    let result = await user.getImportDB(e);
    
    if(result) {
      localStorage.setItem('importDB', result);
      $('#importDBModal').modal('show');
    } else {
      toastr.error('Database could not be imported.');
    }
  });
});
