exportDBFormatModal = `
  <!-- Export Format Modal Begin -->
  <div id='exportDBModal' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'
  aria-hidden='true'>
  <div class='modal-dialog' role='document'>
    <div class='modal-content w-75'>
      
      <form id='exportDBForm'>
      <div class='modal-header text-center'>
        <h4 class='modal-title w-100 font-weight-bold'>
          <i class='fas fa-lock prefix grey-text'></i>
          Export Database
        </h4>
        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      <div class='modal-body my-1 pb-0'>
        <div class='row justify-content-center'>
          <div class='col-12 h5 pb-3 text-center'>
              Choose an export format:
          </div>
          <div class='col-1'>
             <div class='row pb-3'>
               <input id='exportDBPlaintext' name='exportDBFormat' value='plaintext' type='radio' class=''>
             </div>
             <div class='row'>
               <input id='exportDBCiphertext' name='exportDBFormat' value='ciphertext' type='radio' class=''>
             </div>
           </div>
           <div class='col-2'>
             <div class='row pb-2'>
               <label for='exportDBPlaintext' class='m-0'>Plaintext</label>
             </div>
             <div class='row'>
               <label for='exportDBCiphertext' class='m-0'>Ciphertext</label>
             </div>
           </div>
         </div>
      </div>
      
      <div class='row justify-content-center '>
          <div id='exportDBError' class='error-message'>&emsp;</div>
      </div>
      
      <div class='modal-footer d-block'>
        <div class='float-left'>
          <button id='exportDBCancel' class='btn btn-default ml-4'>Cancel</button>
        </div>
      
        <div class='float-right'>
          <button id='exportDBSubmit' class='btn btn-default mr-4'>OK</button>
        </div>
      </div>
      
      <!-- a id='exportDBLink' class='' download='' href=''></a -->
      </form>
      
    </div>
  </div>
  </div>
  <!-- Export Format Modal End -->
`;