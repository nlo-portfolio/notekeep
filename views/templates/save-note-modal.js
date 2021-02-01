saveNoteModal = `
  <!-- Save Note Modal Begin -->
  <div id='saveNoteModal' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'
  aria-hidden='true'>
  <div class='modal-dialog' role='document'>
    <div class='modal-content'>
      
      <form id='saveNoteForm'>
      <div class='modal-header text-center'>
        <h4 class='modal-title w-100 font-weight-bold'>
          <i class='fas fa-folder-plus prefix grey-text'></i>
          Save Note?
        </h4>
        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      
      <div class='modal-footer d-block'>
        <div class='float-left'>
          <button id='saveNoteCancel' class='btn btn-default ml-4'>Cancel</button>
        </div>
      
        <div class='float-right'>
          <button id='saveNoteYes' redirect='' class='btn btn-default mr-4'>Save</button>
        </div>
        
        <div class='float-right'>
          <button id='saveNoteNo' redirect='' class='btn btn-default mr-4'>Don't Save</button>
        </div>
      </div>
      </form>
      
    </div>
  </div>
  </div>
  <!-- Save Note Modal End -->
`;