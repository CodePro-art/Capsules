// ======================================================================= //
// ========================= MAIN JS FILE ================================ //
// ======================================================================= //

// ----------------------- PATHs for API request ------------------------- //
let path = "https://appleseed-wa.herokuapp.com/api/users/";

// -------------------- Create Appleseed instance ------------------------ //
var appleseed = new Appleseed();
const documentFragment = new DocumentFragment();
let category = "firstName";
// ------------------------- Initialze Page ------------------------------ //
async function initPage(){
  
  // appleseed <- data from: local-storage or API
  storage = loadData();
  storage ? appleseed = storage : await fetchAllData();
  
  // Create page layout + table
  createPageLayout();

  // Add sortable option to the table
  const table = document.querySelector('table');
  sortTable(table, true);

  // Define options event listeners
  optionSelect();
}



// storage = JSON.stringify(storage);

