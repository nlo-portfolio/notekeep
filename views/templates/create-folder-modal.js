createFolderModal = `
  <!-- Create Folder Modal Begin -->
  <div id='createFolderModal' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'
  aria-hidden='true'>
  <div class='modal-dialog' role='document'>
    <div class='modal-content'>
      
      <form id='createFolderForm'>
      <div class='modal-header text-center'>
        <h4 class='modal-title w-100 font-weight-bold'>
          <i class='fas fa-folder-plus prefix grey-text'></i>
          Create Folder
        </h4>
        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      <div class='modal-body my-1 pb-0'>
        <div class='row justify-content-center'>
          <div class='col-3'>
             <div class='row pb-3 float-right'>
               <label for='newFolderTitle' class='mt-2 pr-2 float-right'>Folder Title:</label>
             </div>
           </div>
           <div class='col-6'>
             <div class='row pb-3'>
               <input id='newFolderTitle' type='text' class='float-left'>
             </div>
           </div>
         </div>
      </div>
      
      <div class='row justify-content-center '>
          <div id='createFolderError' class='error-message'>&emsp;</div>
      </div>
      
      <div class='modal-footer d-block'>
        <div class='float-left'>
          <button id='createFolderCancel' class='btn btn-default ml-4'>Cancel</button>
        </div>
      
        <div class='float-right'>
          <button id='createFolderSubmit' class='btn btn-default mr-4'>OK</button>
        </div>
      </div>
      
      <!-- a id='exportDBLink' class='' download='' href=''></a -->
      </form>
      
    </div>
  </div>
  </div>
  <!-- Create Folder Modal End -->
`;