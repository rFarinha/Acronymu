const fs = require('fs');
const { shell, ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const settings = require('./settings.js')


let listsPath = './resources/'
const EXTENSION = '.txt'

// SIDEBAR elements
let addToListBtn = document.getElementById('AddToListBtn')
    listsBtn = document.getElementById('ListsBtn')
    settingsBtn = document.getElementById('SettingsBtn')
    learnMoreBtn = document.getElementById('LearnMoreBtn')

// SETTINGs elements
let soundSwitch = document.getElementById("sound-switch");
    clipboardRefreshRate = document.getElementById("clipboardRefreshRate");
    folderIcon = document.getElementById("folderIcon");
    folderPath = document.getElementById("folderPath");

let items = document.getElementById('list-item')
    noItemP = document.getElementById('no-lists')

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
})



//************ UPDATING HTML WHEN CREATING WINDOW *******************
ipcRenderer.on('StartingWindow', function(event, message) {
      openTab(message);
      //localStorage.clear()
      // input from settings
      soundSwitch.checked = settings.getSoundState()
      clipboardRefreshRate.value = settings.getClipboardRefreshRate()
      folderPath.innerHTML = settings.getFolderPath()
});


//************ FUNCTIONS BEING USED *******************

fs.readdir(listsPath, (err, files) => {
  let listSelector = document.getElementById("listTxtsSelect");
  files.forEach(file => {
    if(file.slice(-4, file.length) === EXTENSION){
      let option = document.createElement("option");
      option.text = file;
      listSelector.add(option)
      noItemP.style.display = "none";
      addItem(file, items)
    }
  });
});


function addItem(item, items){
  let itemNode = document.createElement('div')
  itemNode.setAttribute('class', 'item')
  itemNode.innerHTML = `<button class="list-btn" onclick="openFile('${item}')">${item}</button><button class="delete-btn">X</button>`

  items.appendChild(itemNode)
}

function openFile(fileName){
  shell.openExternal('C:/Users/Farinha/Projects/Acronymu/resources/' + fileName);
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
