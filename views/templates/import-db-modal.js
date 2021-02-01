importDBModal = `
  <!-- Import DB Modal Begin -->
  <div id='importDBModal' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'
  aria-hidden='true'>
  <div class='modal-dialog' role='document'>
    <div class='modal-content'>
      
      <form id='importDBForm'>
      <div class='modal-header text-center'>
        <h4 class='modal-title w-100 font-weight-bold'>
          <i class='fas fa-folder-plus prefix grey-text'></i>
          Import Database
        </h4>
        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      
      <div class='col-12 h5 py-3 text-center'>
        This operation will overwrite the existing database and that data will be lost. Proceed?
      </div>
      
      <div class='modal-footer d-block'>
        <div class='float-left'>
          <button id='importDBCancel' class='btn btn-default ml-4'>Cancel</button>
        </div>
      
        <div class='float-right'>
          <button id='importDBSubmit' class='btn btn-default mr-4'>OK</button>
        </div>
      </div>
      
      <!-- a id='exportDBLink' class='' download='' href=''></a -->
      </form>
      
    </div>
  </div>
  </div>
  <!-- Create Folder Modal End -->
`;