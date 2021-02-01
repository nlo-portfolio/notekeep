let loginHTML = `
    <div class='container-fluid'>
      <form id='loginForm'>
      <div class='d-flex flex-row justify-content-center align-items-center' style='height: 90vh;'>
        <div class='col-12 col-md-6 login-container panel-rounded'>
          <div class='col'>
            <div class='row h3 justify-content-center no-gutters border-bottom border-solid border-dark'>          
              <i class='fas fa fa-chess-rook pr-3'></i>NoteKeep: Login
            </div>
          </div>
          
          <div class='row justify-content-center text-danger'>
            <div id='loginError' class='py-1'></div>
          </div>
        
          <div class='col pt-2 w-100'>
            <input type='text' class='form-control input text-center' id='loginUsername' placeholder='Enter username'>
          </div>

          <div class='col pt-3'>
            <input type='password' class='form-control input text-center' id='loginPassword' placeholder='Enter password'>
          </div>
          
          <div class='col pt-3'>
            <button id='loginSubmit' type='submit' class='btn btn-primary w-100'>Login</button>
          </div>
          
          <div class='col pt-3'>
            <medium id='createUserLink' class='form-text text-muted text-center'><a href=''>Create a new user</a></medium>
          </div>
        </div>
      </div>
      </form>
    </div>
`;