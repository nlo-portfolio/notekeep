editFolderModal = `
  <!-- Edit Folder Modal Begin -->
  <div id='editFolderModal' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'
  aria-hidden='true'>
  <div class='modal-dialog' role='document'>
    <div class='modal-content'>
      
      <form id='editFolderForm'>
      <div class='modal-header text-center'>
        <h4 class='modal-title w-100 font-weight-bold'>
          <i class='fas fa-folder-plus prefix grey-text'></i>
          Edit Folder
        </h4>
        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      <div class='modal-body my-1 pb-0'>
        <div class='row justify-content-center'>
          <div class='col-3'>
             <div class='row pb-3 float-right'>
               <label for='editFolderTitle' class='mt-2 pr-2 float-right'>Folder Title:</label>
             </div>
           </div>
           <div class='col-6'>
             <div class='row pb-3'>
               <input id='editFolderTitle' type='text' class='float-left'>
             </div>
           </div>
           
           <div class='row my-3'>
             <div class='pt-1'>&emsp;Folder:</div>
               <div id='editFolderListContainer' class='col'>
               </div>
           </div>
           
         </div>
      </div>
      
      <div class='row justify-content-center '>
          <div id='editFolderError' class='error-message'>&emsp;</div>
      </div>
      
      <div class='modal-footer d-block'>
        <div class='float-left'>
          <button id='editFolderCancel' class='btn btn-default ml-4'>Cancel</button>
        </div>
      
        <div class='float-right'>
          <button id='editFolderSubmit' uuid='' class='btn btn-default mr-4'>OK</button>
        </div>
      </div>
      
      <!-- a id='exportDBLink' class='' download='' href=''></a -->
      </form>
      
    </div>
  </div>
  </div>
  <!-- Edit Folder Modal End -->
`;