// ======================================================================= //
// ============================ FUNCTIONS ================================ //
// ======================================================================= //

// ------------------------ FETCH FROM API ------------------------------- //
async function getAPI(){
  try{
    const promise = await fetch(path);
    return await promise.json();
  }catch(err){
    console.log(err);
  }
}

// ------------------------ Insert info ino the class --------------------- //
function insertDataToClass(main,secondary){
  appleseed.addMember(main,secondary);
}

// ------------------------- FETCH secondary data ------------------------- //
async function getSecondary(main){
  for(let i=0; i<main.length ;i++){
    const promise = await fetch(path + `${main[i].id}`);
    let secondary = await promise.json();
    insertDataToClass(main[i],secondary);
  }
}

// ------------------------- FETCH All data ------------------------------- //
async function fetchAllData(){
  try{
    const main = await getAPI();
    await getSecondary(main);
    saveData();
  }catch(err){
    console.log(err);
  }
}

// --------------------- LOCAL STORAGE - save ----------------------------- //
function saveData(){
  localStorage.setItem('storage', JSON.stringify(appleseed));
}

// -------------------- LOCAL STORAGE - load ------------------------------ //
function loadData(){
  let storage = localStorage.getItem('storage');
  return JSON.parse(storage);
}

// ------------------------- Create page layout ---------------------------- //
function createPageLayout(){

  // Create container to the page
  const container = document.createElement("div");
  container.className ="container";
  document.body.appendChild(container);

  // Add header
  addHeader();

  // create table head
  createTable();
  
  // Add data to the table
  updateTable();

  // update event listeners
  updateEventListener("edit");
  updateEventListener("trash");

}

// ------------------------- Create Table --------------------------------- //
function createTable(){
  const container = document.querySelector('.container');
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  
  table.className = "table";
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Capsule</th>
      <th>Age</th>
      <th>City</th>
      <th>Gender</th>
      <th>Hobby</th>
      <th data-sortable="false">Actions</th>
    </tr>`;
  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

// ------------------------- Add row to Table ------------------------------ //
async function addRow(member){
  const tbody = document.querySelector("tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
  <tr class="row-${member.id}">
    <td>${member.id}</td>
    <td>${member.firstName}</td>
    <td>${member.lastName}</td>
    <td>${member.capsule}</td>
    <td>${member.age}</td>
    <td>${member.city}</td>
    <td>${member.gender}</td>
    <td>${member.hobby}</td>
    <td>
      <div class="btn-group btn-group-sm" role="group">
        <button type="button" class="btn-edit"><i class="fas fa-pen"></i></button>
        <button type="button" class="btn-trash"><i class="fas fa-trash"></i></button>
      </div>
    </td>
  </tr>`;
  tbody.appendChild(row);
}

// ------------------------- Add header to page ------------------------------ //
function addHeader(){
  const container = document.querySelector('.container');
  const head = document.createElement("header");
  head.innerHTML = `
  <h3>Table</h3>
    <section class="search-container">
      <input oninput="updateResult(this.value)" type="search" placeholder="Search...">
      <select name="category" id="category">
        <option value="Search by" selected disabled hidden>Search by</option>
        <option value="id">ID</option>
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
        <option value="capsule">Capsule</option>
        <option value="age">Age</option>
        <option value="city">City</option>
        <option value="gender">Gender</option>
        <option value="hobby">Hobby</option>
      </select>
    </section>`;
  container.appendChild(head);
}

// --------------------------- Update Results -------------------------------- //
function updateTable() {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  // Add data to the table
  appleseed.list.forEach(member => {
    addRow(member);
  });
}

// --------------------------- Get cell value -------------------------------- //
const getCellValue = cell => cell.innerText || cell.textContent;

// -------------------------- Compare cell value ----------------------------- //
const compareValue = (valueOne, valueTwo) => {
  return (
    valueOne !== '' && valueTwo !== '' &&
    !isNaN(valueOne) && !isNaN(valueTwo)
  )
    ? valueOne - valueTwo
    : valueOne.toString().localeCompare(valueTwo.toString());
}
// -------------------------- Compare cell value ----------------------------- //
const sort = (tBody, index, sortDirection) => {
  const tbodyRows = [...tBody.rows];
  
  const sortedRows = tbodyRows.sort((a, b) => {
    const aCellValue = getCellValue(a.cells[index]);
    const bCellValue = getCellValue(b.cells[index]);
    return sortDirection ? compareValue(aCellValue, bCellValue) : compareValue(bCellValue, aCellValue);
  });

  while(tBody.firstElementChild) {
    tBody.removeChild(tBody.lastElementChild);
  }
  documentFragment.append(...sortedRows);
  tBody.appendChild(documentFragment);
}   

// ------------------------------- Sort Table -------------------------------- //
const sortTable = (element, ascending = true) => {
  
  const [arrowUp, arrowDown, arrowUpDown] = ['\u2191', '\u2193', '\u21C5'];
  const { tHead, tBodies } = element;
  const [tBody] = tBodies; 
  const theadCells = tHead.querySelectorAll('th:not([data-sortable="false"])'); // select: 8 th's: id,fn,ln,capsule..
 
  
  if (!element.classList.contains('table-sortable')) {
    element.classList.add('table-sortable');
  }
  
  theadCells.forEach((theadCell, index) => {
    let isAscending = !ascending;
    
    theadCell.dataset.sortDirection = arrowUpDown;
    
    theadCell.addEventListener('click', e => {
      theadCells.forEach(cell => {
        if (cell.dataset.sortDirection !== arrowUpDown) {
          cell.dataset.sortDirection = arrowUpDown;
        }
      });
      
      e.target.dataset.sortDirection = isAscending ? arrowUp : arrowDown;
     
      sort(tBody, index, isAscending);
      isAscending = !isAscending;
    });
  });
  
  // Sort the first column/cell by default
  theadCells[0].dataset.sortDirection = ascending ? arrowUp : arrowDown;
  sort(tBody, 0, ascending);
}

// -------------------- Find index of element ---------------------------- //
function findIndexOf(id){
  for(let i=0; i<appleseed.list.length;i++){
    if(appleseed.list[i].id == id){
      return i;
    }
  }
  return -1;
} 

// ---------------------- Remove element ---------------------------------- //
function removeElement(index){
  appleseed.list.splice(index,1);
  saveData();
} 
// ---------------------- disable other buttons ---------------------------- //
function disableAllButtons(){
  const buttons = document.querySelectorAll('button');
  
  buttons.forEach((btn)=>{
    btn.disabled = true;
  });
  
} 
// ---------------------- disable other buttons ---------------------------- //
function enableAllButtons(){
  const buttons = document.querySelectorAll('button');
  
  buttons.forEach((btn)=>{
    btn.disabled = false;
  });
} 

// ------------------ confirm changes in element -------------------------- //
function saveChanges(row,id){
  let arr = Object.values(row.cells);
  for(let i=0;i<arr.length;i++){
    arr[i] = arr[i].innerHTML;
  }
  let index = findIndexOf(id);
  appleseed.list[index].id = arr [0];
  appleseed.list[index].firstName = arr [1];
  appleseed.list[index].lastName = arr [2];
  appleseed.list[index].capsule = arr [3];
  appleseed.list[index].age = arr [4];
  appleseed.list[index].city = arr [5];
  appleseed.list[index].gender = arr [6];
  appleseed.list[index].hobby = arr [7];
  saveData();
}

// ----------------------------- search algorithm -------------------------- //

function updateResult(query){ 
  
  let filtered =  appleseed.list.filter((item)=>item[category].toString().toLowerCase().includes(query.toLowerCase()));
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  // Add data to the table
  filtered.forEach(member => {
    addRow(member);
  });
}