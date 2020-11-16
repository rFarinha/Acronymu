// Access to clipboard
const { clipboard } = require('electron')
// Access to read file
const fs = require("fs")
const settings = require("./settings")

// Access to mensages from main.js
const { ipcRenderer } = require('electron')

//SETTINGS
let intervalToReadCipboard = settings.getClipboardRefreshRate()// ms

//VARAIBLES INIT
let acronym = ''
let sigla = ''
//let path = 'resources/'
//let file = 'IP.txt'

let acronymArray = []
let savedActiveList = ''

// Repeat mainLoop function every {intervalToReadCipboard} seconds
sendInfoToMain()
setInterval(mainLoop, intervalToReadCipboard)

function mainLoop(){
  acronymToSearch = readClipBoard()
  //acronymArray = newListIsSelected()
  console.log('Acronym to search: ' + acronymToSearch)
  // Get active list, if AllList selected, transform all lists into a single array
  let currentActiveList = settings.getActiveList()
  if(currentActiveList !== savedActiveList){
    savedActiveList = currentActiveList
    if(currentActiveList === 'AllLists'){
      AllListsToArray()
    }else{
      newListIsSelected()
    }
  }
  if(acronymToSearch){
    let [title, body] = searchList(acronymToSearch, acronymArray);
    // push notification
    if(title && body){
      pushNotification(title, body, !settings.getSoundState());
    }
  }
}


// Function to return clipboard text if
function readClipBoard () {
  let clipboardText = clipboard.readText()
  // Is an acronym and different?
  if(clipboardText !== acronym && clipboardText.length <= settings.getAcronymMaxSize()){
    acronym = clipboardText
    return acronym
  }else{
    return null
  }
}

// Push notification with acronym and meaning found
function pushNotification (title, text, silence = true){

  const myNotification = new Notification(title, {
    body: text,
    silent: silence,
    icon: './img/icon.png',
    timeoutType: 'default',
  })
}

// Search array for acronym
function searchList(acronymToSearch, array){
  console.log('SEARCHING...')
  let title = '';
  let body = '';

  array.forEach(line  => {
    let [acronymInList, meaning] = line.split(',');
    if(acronymInList === acronymToSearch){
      title = acronymInList;
      body = meaning;
    }
  });

  return [title, body]
}

function newListIsSelected(){
  console.log('new list...')
  path = settings.getFolderPath()
  file = settings.getActiveList()
  console.log('path + file: ' + path + '\\' + file)
  acronymArray =  transformTxtToArray(path, file)
}

module.exports = { newListIsSelected };

function AllListsToArray(){

}

// Transform txt with acronyms into array
function transformTxtToArray(path, file){
  console.log('New Array created...')
  var data = fs.readFileSync(path + '\\' +  file);
  return data.toString().split("\n");
}

// Send info to main to update tray with lists in fodel and active List
function sendInfoToMain(){
  ipcRenderer.send('folderPath', settings.getFolderPath() + ',' + settings.getActiveList())
}

// Received from Tray new active List and save in Settings
ipcRenderer.on('saveActiveList', function(event, message) {
  console.log(message)
  settings.setActiveList(message)
  newListIsSelected()
})
