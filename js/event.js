
// ======================================================================= //
// ============================ EVENTS =================================== //
// ======================================================================= //

// ------------------- EDIT event listener ------------------------------- //
function editEvent(){
  const edits = document.querySelectorAll('.btn-edit');
  edits.forEach((btn) => {
    btn.addEventListener('click',() => {

      btn.firstElementChild.className = "fa fa-check";
      btn.className = 'btn-confirm';

      let row = btn.parentElement.parentElement.parentElement;
      let id = row.firstElementChild.innerHTML;
      row.classList.add('editable');
      row.contentEditable = "true";

      disableAllButtons();
      btn.disabled = false;
      updateEventListener("confirm",id);
    });
  });
}

// ------------------- DELETE event listener ----------------------------- //
function deleteEvent(){
  const trash = document.querySelectorAll('.btn-trash');
  trash.forEach((btn) => {
    btn.addEventListener('click',() => {
      let row = btn.parentElement.parentElement.parentElement;
      row.remove();
      let id = row.firstElementChild.innerHTML;
      removeElement(findIndexOf(id))
    });
  });
}

// ------------------- CONFIRM event listener ---------------------------- //
function confirmEvent(id){
  const confirm = document.querySelector('.btn-confirm');
  const row = document.querySelector('.editable');
  
  if(confirm)
    confirm.addEventListener('click',() => {
      confirm.firstElementChild.className = "fas fa-pen";
      confirm.className = 'btn-edit';
      enableAllButtons();
      row.classList.remove('editable');
      row.contentEditable = "false";
      saveChanges(row,id);
      location.reload();
    }); 
}

// ------------------- Switch case for event listeners -------------------- //
function updateEventListener(option,id){
  switch(option) {
  case "edit":
    editEvent();
    break;
  case "trash":
    deleteEvent();
    break;
  case "confirm":
    confirmEvent(id);
    break;
  default:
    // code block
  }
}

// ------------------- filter by option select ---------------------------- //

function optionSelect (){
  let select = document.querySelector('select');
  let search = document.querySelector('input');
 
  select.addEventListener('change', function() {
  category = this.value;
  updateResult(search.value);
  });
}
