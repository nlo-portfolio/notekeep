changePasswordModal = `
  
  <div id='changePasswordForm' class=''>
      
    
  <!--  Change Password Modal Begin -->
  <div id='changePasswordModal' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'
  aria-hidden='true'>
  <div class='modal-dialog' role='document'>
    <div class='modal-content'>
      <div class='modal-header text-center'>
        <h4 class='modal-title w-100 font-weight-bold'>
          <i class='fas fa-lock prefix grey-text'></i>
          Change Password
        </h4>
        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      <div class='modal-body pb-0'>
        <div class='md-form mb-3'>
          <label for='currentPassword'>Current Password</label>
          <input id='currentPassword' type='password' class='form-control'>
         
        </div>

        <div class='md-form mb-3'>
          <label for='newPassword1'>New password</label>
          <input id='newPassword1' type='password' class='form-control'>
          
        </div>
        
        <div class='md-form mb-3'>
          <label for='newPassword2' data-error='wrong' data-success='right'>Confirm password</label>
          <input id='newPassword2' type='password' class='form-control'>
        </div>

      </div>
      
      <div class='row justify-content-center '>
          <div id='changePasswordError' class='error-message'>&emsp;</div>
      </div>
      
      <div class='modal-footer d-block'>
        <div class='float-left'>
          <button id='changePasswordCancel' class='btn btn-default ml-4'>Cancel</button>
        </div>
      
        <div class='float-right'>
          <button id='changePasswordSubmit' class='btn btn-default mr-4'>OK</button>
        </div>
      </div>
    </div>
  </div>
  </div>

  <!-- div class='text-center'>
    <a href='' class='btn btn-default btn-rounded mb-4' data-toggle='modal' data-target='#modalLoginForm'>Launch
      Modal Login Form</a>
  </div -->
  <!-- Change Password Modal End -->
`;