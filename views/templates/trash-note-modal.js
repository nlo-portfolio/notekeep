trashNoteModal = `
  <!-- Trash Note Modal Begin -->
  <div id='trashNoteModal' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'
  aria-hidden='true'>
  <div class='modal-dialog' role='document'>
    <div class='modal-content'>
      
      <form id='trashNoteForm'>
      <div class='modal-header text-center'>
        <h4 class='modal-title w-100 font-weight-bold'>
          <i class='fas fa-folder-plus prefix grey-text'></i>
          Permanently delete note?
        </h4>
        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      
      <div class='modal-footer d-block'>
        <div class='float-left'>
          <button id='trashNoteCancel' class='btn btn-default ml-4'>Cancel</button>
        </div>
      
        <div class='float-right'>
          <button id='trashNoteSubmit' uuid='' redirect='' class='btn btn-default mr-4'>Confirm</button>
        </div>

      </div>
      </form>
      
    </div>
  </div>
  </div>
  <!-- Trash Note Modal End -->
`;