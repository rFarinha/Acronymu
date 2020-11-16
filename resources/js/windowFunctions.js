const fs = require('fs');
const { shell, ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const settings = require('./settings.js')
const listFunctions = require('./listFunctions')
const path = require('path')

let listsPath = './resources/'
const EXTENSION = '.txt'
let modalTargetFile = ''

// SIDEBAR elements
let addToListBtn = document.getElementById('AddToListBtn')
    listsBtn = document.getElementById('ListsBtn')
    settingsBtn = document.getElementById('SettingsBtn')
    learnMoreBtn = document.getElementById('LearnMoreBtn')
// ADD TO LIST elements
let listTxtsSelect = document.getElementById("listTxtsSelect");
    textAreaToAdd = document.getElementById("text-area-to-add");
    addAcronym = document.getElementById("addAcronym");
    removeAcronym = document.getElementById("removeAcronym");

// LISTs Tab elements
let listItems = document.getElementById('list-item')
    noItemP = document.getElementById('no-lists')
    itemsButtonArray = document.getElementsByClassName('list-btn')
    deleteButtons = document.getElementsByClassName('delete-btn')
    modalDelete = document.getElementById('modalDelete')
    closeModal = document.getElementsByClassName("close");
    yesDelete = document.getElementById('yesDelete')
    noDelete = document.getElementById('noDelete')
    openFileButtons = document.getElementsByClassName('open-file-btn')
    modalCreate = document.getElementById('modalCreate')
    createListBtn = document.getElementById('createList')
    cancelCreateBtn = document.getElementById('cancelCreate')
    nameNewList = document.getElementById('nameNewList')
    createListConfirmBtn = document.getElementById('createListConfirmBtn')

// SETTINGs elements
let soundSwitch = document.getElementById("sound-switch");
    clipboardRefreshRate = document.getElementById("clipboardRefreshRate");
    folderIcon = document.getElementById("folderIcon");
    folderPath = document.getElementById("folderPath");
    maxSizeInput = document.getElementById("maxSize");

let btns = document.getElementsByClassName("btn");
    tabs = document.getElementsByClassName("tab");


//************ CHANGE TAB *******************
function openTab(Tab) {

  // Loop through the buttons and add the active class to the current/clicked button
  for (let i = 0; i < btns.length; i++) {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      document.getElementById(Tab + 'Btn').className += " active";
  }
  var i;
  // Hide all tabs

  for (i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  // Show correct Tab
  document.getElementById(Tab).style.display = "block";
}

// TAB SideBar listeners for click
addToListBtn.addEventListener('click', e => {
  openTab('AddToList')
  listTxtsSelect.value = settings.getActiveList()
})
listsBtn.addEventListener('click', e => {
  openTab('Lists')
  UpdateListOfListsHtml()
})
settingsBtn.addEventListener('click', e => {
  openTab('Settings')
})
learnMoreBtn.addEventListener('click', e => {
  openTab('LearnMore')
})

//************ ADD to List Buttons ****************
addAcronym.addEventListener('click', e => {
  listFunctions.addToList(
    settings.getFolderPath() + '\\' + listTxtsSelect.value, // LIST
    textAreaToAdd.value) // TEXT
    CleanTextArea()
})

removeAcronym.addEventListener('click', e => {
  listFunctions.removeFromList(
    settings.getFolderPath() + '\\' + listTxtsSelect.value, // LIST
    textAreaToAdd.value) // TEXT
    CleanTextArea()
})

//*********** CREATE NEW LIST *********************

document.addEventListener('click', function(e){
  // Find list buttons to select new active list
  if(e.target.classList.contains('list-btn')){
    console.log('SAVING NEW active list')
    settings.setActiveList(e.target.id)
    UpdateListOfListsHtml()
    ipcRenderer.send('folderPath', settings.getFolderPath() + ',' + settings.getActiveList())
  }
  // If delete list button pressed, read ID to select right list and open delete modal
  if(e.target.classList.contains('delete-btn')){
     console.log('delete file...' + e.target.id)
     modalTargetFile = e.target.id
     showModalDeleteList()
  }
  // If open file icon pressed, read id to select right list, and open TXT
  if(e.target.classList.contains('open-file-btn')){
    openFile(e.target.id)
  }
})

// MODAL DELETE content functions

function showModalDeleteList(){
  modalDelete.style.display = "block";
}

closeModal[0].onclick = function() {
  modalDelete.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modalDelete || event.target == modalCreate || event.target == cancelCreateBtn ) {
    modalDelete.style.display = "none";
    modalCreate.style.display = "none";
  }
}

noDelete.onclick = function(event) {
  modalDelete.style.display = "none";
}

yesDelete.onclick = function(event) {
  // Delete the file and update list of list
  listFunctions.deleteListFile(modalTargetFile)

  if(modalTargetFile === settings.getActiveList()){
    setTimeout(ActiveAllLists,200)
  }
  setTimeout(UpdateListOfListsHtml,500)
  modalDelete.style.display = "none";
}

// MODAL CREATE functions
createListBtn.onclick = function(event){
  modalCreate.style.display = "block";
  // Select the text before the extension
  nameNewList.focus()
  nameNewList.value = "Name.txt"
  nameNewList.setSelectionRange(0, 4);
}

closeModal[1].onclick = function() {
  modalCreate.style.display = "none";
}

createListConfirmBtn.onclick = function(event) {
  listFunctions.createNewList(nameNewList.value)
  setTimeout(UpdateListOfListsHtml,500)
  modalCreate.style.display = "none";
}


//************ SETTINGS Buttons *******************
soundSwitch.addEventListener('click', e => {
  settings.setSoundState(soundSwitch.checked)
})

clipboardRefreshRate.addEventListener('change', e => {
  console.log(clipboardRefreshRate.value)
  settings.setClipboardRefreshRate(clipboardRefreshRate.value)
})

folderIcon.addEventListener('click', e => {
  // Select PATH with lists
  let pathToLists = getPathFromUser()
  console.log("TEST: " + pathToLists)
  if(typeof pathToLists !== 'undefined'){
    // Save the PATH and HTML
    settings.saveFolderPath(pathToLists)

    ActiveAllLists()

    folderPath.value = pathToLists
    UpdateListOfListsHtml()
  }
})

maxSizeInput.addEventListener('change', e => {
  console.log(maxSizeInput.value)
  settings.setAcronymMaxSize(maxSizeInput.value)
})



//************ UPDATING HTML WHEN CREATING WINDOW *******************
ipcRenderer.on('StartingWindow', function(event, message) {
      openTab(message);
      //localStorage.clear()
      // input from settings
      soundSwitch.checked = settings.getSoundState()
      clipboardRefreshRate.value = settings.getClipboardRefreshRate()
      folderPath.value = settings.getFolderPath()
      maxSizeInput.value = settings.getAcronymMaxSize()
      UpdateListOfListsHtml()
});


//************ FUNCTIONS BEING USED *******************
function UpdateListOfListsHtml(){
  //settings.clearLocalStorage()
  console.log('Update List of Lists')
  fs.readdir(settings.getFolderPath(), (err, files) => {
    removeItems()
    addAllBtn(listItems)
    files.forEach(file => {
      if(file.slice(-4, file.length) === EXTENSION){
        let option = document.createElement("option");
        option.text = file;
        listTxtsSelect.add(option)
        noItemP.style.display = "none";
        addItem(file, listItems)
      }
    });
  });
  pathToLists = settings.getFolderPath()
  ipcRenderer.send('folderPath', pathToLists + ',' + settings.getActiveList())
}

// Add Button to list of lists to activate "All Lists"
function addAllBtn(items){
  let itemNode = document.createElement('div')
  itemNode.setAttribute('class', 'item')
  if(settings.getActiveList() === 'AllLists'){
    itemNode.innerHTML = `<button class="list-btn active" id="AllLists">All Lists</button>`
  }else{
    itemNode.innerHTML = `<button class="list-btn" id="AllLists">All Lists</button>`
  }
  items.appendChild(itemNode)
}

// Add a button in list of lists for each txt in folder
function addItem(item, items){
  let activeItem = settings.getActiveList()
  console.log(activeItem)
  let itemNode = document.createElement('div')
  itemNode.setAttribute('class', 'item')
  if(item === activeItem){
    itemNode.innerHTML = `<button class="list-btn active" id="${item}">${item}</button><input id="${item}" class="open-file-btn icon" type="image" src="./img/file-alt-regular.svg"><button id="${item}" class="delete-btn">X</button>`
  }else{
    itemNode.innerHTML = `<button class="list-btn" id="${item}">${item}</button><input id="${item}" class="open-file-btn icon" type="image" src="./img/file-alt-regular.svg"><button id="${item}" class="delete-btn">X</button>`
  }
  items.appendChild(itemNode)
}

function removeItems(){

  // REMOVE from select in TAB 1 (Add to List)
  let selectLength = listTxtsSelect.length
  console.log(`removing ${selectLength} items...`)
  for (i = selectLength-1; i >= 0; i--) {
    listTxtsSelect.options[i] = null;
  }

    // REMOVE from list in TAB 2 (Lists)
    listItems.textContent = '';
}


function openFile(fileName){
  console.log('open file')
  shell.openExternal(settings.getFolderPath() + '\\' + fileName);
}

const getPathFromUser = () => {

    const pathArray = dialog.showOpenDialogSync(
      {title: 'Select Directory',
      message: 'Select Directory',
      defaultPath: path.join(settings.getFolderPath(),'../'),
      properties: ['openDirectory']})

    if (!pathArray) {
        return;
    }
    console.log(pathArray[0])
    return pathArray[0]
}

function CleanTextArea(){
  // Clean text textArea
  textAreaToAdd.value = ''
  textAreaToAdd.placeholder = 'Added'
  setInterval(function(){textAreaToAdd.placeholder = 'ACRONYM, meaning'},3000);
}

ipcRenderer.on('saveActiveList', function(event, message) {
  console.log('UPDATE LISTS')
  UpdateListOfListsHtml()
})

function ActiveAllLists(){
  settings.setActiveList('AllLists')
}
