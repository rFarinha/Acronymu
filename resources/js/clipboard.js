// Access to clipboard
const { clipboard } = require('electron')
// Access to read file
const fs = require("fs")
const settings = require("./settings")

// Access to mensages from main.js
const { ipcRenderer } = require('electron')

//SETTINGS
let acronymMaxSize = 10
let intervalToReadCipboard = settings.getClipboardRefreshRate()// ms

//VARAIBLES INIT
let acronym = ''
let sigla = ''
//let path = 'resources/'
//let file = 'IP.txt'

let acronymArray = []

// Repeat mainLoop function every {intervalToReadCipboard} seconds
sendInfoToMain()
newListIsSelected()
setInterval(mainLoop, intervalToReadCipboard)

function mainLoop(){
  acronymToSearch = readClipBoard()
  //acronymArray = newListIsSelected()
  console.log(acronymToSearch)
  if(acronymToSearch){
    let [title, body] = searchList(acronymToSearch, acronymArray);
    // push notification
    if(title && body){
      pushNotification(title, body, !settings.getSoundState());
    }
  }
}

/**
 * Function to return clipboard text if
 */
function readClipBoard () {
  let clipboardText = clipboard.readText()
  // Is an acronym and different?
  if(clipboardText !== acronym && clipboardText.length < acronymMaxSize){
    acronym = clipboardText
    return acronym
  }else{
    return null
  }
}


function pushNotification (title, text, silence = true){

  const myNotification = new Notification(title, {
    body: text,
    silent: silence,
    icon: './img/icon.png',
    timeoutType: 'default',
  })
}

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

// Transform txt with acronyms into array
function transformTxtToArray(path, file){
  console.log('New Array created...')
  var data = fs.readFileSync(path + '\\' +  file);
  return data.toString().split("\n");
}


function sendInfoToMain(){
  let folderPath = settings.getFolderPath()
  ipcRenderer.send('folderPath', folderPath)
}

ipcRenderer.on('saveActiveList', function(event, message) {
  console.log(message)
  settings.setActiveList(message)
  newListIsSelected()
})
