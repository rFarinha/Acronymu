const fs = require('fs');
const { shell, ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const settings = require('./settings.js')
const listFunctions = require('./listFunctions')


let listsPath = './resources/'
const EXTENSION = '.txt'

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

// SETTINGs elements
let soundSwitch = document.getElementById("sound-switch");
    clipboardRefreshRate = document.getElementById("clipboardRefreshRate");
    folderIcon = document.getElementById("folderIcon");
    folderPath = document.getElementById("folderPath");

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
})
listsBtn.addEventListener('click', e => {
  openTab('Lists')
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


//************ SETTINGS Buttons *******************
soundSwitch.addEventListener('click', e => {
  settings.setSoundState(soundSwitch.checked)
})

clipboardRefreshRate.addEventListener('change', e => {
  console.log(clipboardRefreshRate.value)
  settings.setClipboardRefreshRate(clipboardRefreshRate.value)
})

folderIcon.addEventListener('click', e => {
  let pathToLists = getPathFromUser()
  settings.saveFolderPath(pathToLists)
  folderPath.innerHTML = pathToLists
  UpdateListOfListsHtml()
  //console.log('SendingInfoToMain')
  ipcRenderer.send('folderPath', pathToLists)
})



//************ UPDATING HTML WHEN CREATING WINDOW *******************
ipcRenderer.on('StartingWindow', function(event, message) {
      openTab(message);
      //localStorage.clear()
      // input from settings
      soundSwitch.checked = settings.getSoundState()
      clipboardRefreshRate.value = settings.getClipboardRefreshRate()
      folderPath.innerHTML = settings.getFolderPath()
      UpdateListOfListsHtml()
});


//************ FUNCTIONS BEING USED *******************
function UpdateListOfListsHtml(){
  fs.readdir(settings.getFolderPath(), (err, files) => {
    removeItems()
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
}


function addItem(item, items){
  let itemNode = document.createElement('div')
  itemNode.setAttribute('class', 'item')
  itemNode.innerHTML = `<button class="list-btn" id="${item}-list-btn')">${item}</button><button class="delete-btn">X</button>`

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
  shell.openExternal(settings.getFolderPath + fileName);
  // saveFolderPath ()
  //console.log(storage.getFolderPath())
}



const getPathFromUser = () => {

    const pathArray = dialog.showOpenDialogSync(
      {title: 'Select Directory',
      message: 'Select Directory',
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
