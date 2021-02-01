let createUserForm = `
    <div class='container-fluid'>
      <form id='createUserForm'>
      <div class='d-flex flex-row justify-content-center align-items-center' style='height: 90vh;'>
        <div class='col-12 col-md-6 login-container panel-rounded'>
          <div class='col'>
            <div class='row h3 justify-content-center no-gutters border-bottom border-solid border-dark'>          
              <i class='fas fa fa-chess-rook pr-3'></i>NoteKeep: New User
            </div>
          </div>
          
          <div class='row justify-content-center text-danger'>
            <div id='createUserError' class='py-1'></div>
          </div>
        
          <div class='col pt-2 w-100'>
            <input type='text' class='form-control input text-center' id='newUsername' placeholder='Enter username'>
          </div>

          <div class='col pt-3'>
            <input type='password' class='form-control input text-center' id='newPassword1' placeholder='Enter password'>
          </div>
          
          <div class='col pt-3'>
            <input type='password' class='form-control input text-center' id='newPassword2' placeholder='Confirm password'>
          </div>
          
          <div class='col pt-3'>
            <button id='createUserSubmit' type='submit' class='btn btn-primary w-100'>Submit</button>
          </div>
          
        </div>
      </div>
      </form>
    </div>
`;