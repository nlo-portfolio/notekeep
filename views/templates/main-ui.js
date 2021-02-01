mainUI = function() { return `
  <div class='container-fluid main-ui'>
    <div class='row justify-content-center container-row'>
      <div id='menu' class='col-4'>
        <div id='menuWindow' class='row panel panel-rounded panel-shadow'>
          <div id='header' class='col header'>
            <div class='row no-gutters border-bottom border-dark'>          
              <div id='logoHeader' class='col-12 h1 text-center border-bottom border-dark'>
                <i class='fas fa fa-chess-rook pr-2 justify-content-center '></i>
                NoteKeep
              </div>
              <div id='usernameHeader' class='col text-center'>
                User: ${_.escape(window.username)}
              </div>
            </div>
          </div>
          <div class='row'>
            <div id='navbar-container' class='col-1 navbar-container navbar-border'>
              <div class='col navbar navbar-default'>
                <ul class='navbar-list'>
                  <li id='backArrow' class='navbar-item' title='Back' style='' uuid=''><i class='fas fa-2x fa-chevron-left'></i></li>
                  <li id='createNote' class='navbar-item' title='New Note'><i class='fas fa-2x fa-plus'></i></li>
                  <li id='createFolder' class='navbar-item' title='New Folder'><i class='fas fa-2x fa-folder-plus'></i></li>
                  <li id='saveNote' class='navbar-item' title='Save'><i class='fas fa-2x fa-save'></i></li>
                  <li id='showTrash' class='navbar-item' title='Trash'><i class='fas fa-2x fa-trash'></i></li>
                </ul>
              </div>

              <div class='col navbar-list-bottom'>
                <ul class='navbar-list'>
                  <li id='exportDB' class='navbar-item' title='Export Database'>
                    <i class='fas fa-2x fa-file-export'></i>
                  </li>
                  <li id='importDB' class='navbar-item' title='Import Database'>
                    <label for='importDBFile'>
                      <i class='fas fa-2x fa-file-import'></i>
                    </label>
                    <input id='importDBFile' type='file' name='' style='display:none;'>
                  </li>
                  <li id='changePassword' class='navbar-item' title='Change Password'><i class='fas fa-2x fa-key'></i></li>
                  <li id='logoutButton' class='navbar-item' title='Logout'><i class='fas fa-2x fa-lock'></i></li>
                </ul>
              </div>
            </div>
          
            <div class='col outerResultsWindow'>
              <div id='searchRow' class='row searchRow'>
                <div class='col'>
                  <input type='search' class='form-control input searchInput' id='search' placeholder='Enter Search Text...'>
                  <div id='empty-message'></div>
                </div>
              </div>
              <div class='row'>
                <div id='innerResultsWindow' class='col-12'>
                  <!-- Results Window -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id='noteWindow' class='col-8 panel panel-rounded panel-shadow'>
        <input type='text' class='form-control input mt-3' id='noteTitle' placeholder='Note Title...'>
        
        <div id='noteInfoRow' class='row my-3'>
          <div class='ml-4'>&nbsp;Folder:</div>
            <div id='folderListContainer' class='col-5'>
              ${window.view.getFolderList()}
            </div>
          <div id='lastSavedMessage' class='col text-right'></div>
        </div>
 
        <textarea type='text' class='form-control textarea' id='noteBody' placeholder='Note Text...'></textarea>
      </div>
    </div>
  </div>
  ${changePasswordModal}
  ${createFolderModal}
  ${editFolderModal}
  ${trashNoteModal}
  ${trashFolderModal}
  ${importDBModal}
  ${exportDBFormatModal}
  ${saveNoteModal}
  `
};