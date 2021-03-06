// Access to clipboard
const { clipboard} = require('electron')
// Access to read file
const fs = require("fs")
const settings = require("./settings")
const path = require("path")

// Access to mensages from main.js
const { ipcRenderer } = require('electron')

//SETTINGS
let intervalToReadCipboard = settings.getClipboardRefreshRate()// ms
const EXTENSION = '.txt'
//VARAIBLES INIT
let acronym = ''
let sigla = ''
//let path = 'resources/'
//let file = 'IP.txt'

let acronymArray = []
let savedActiveList = ''
let savedPath = ''

const assetsPath = require('electron').remote.app.isPackaged ? path.join(process.resourcesPath, 'img') : path.join(__dirname,'..','img');
const iconPath = path.join(assetsPath, 'icon.ico')

// Repeat mainLoop function every {intervalToReadCipboard} seconds
sendInfoToMain()
setInterval(mainLoop, intervalToReadCipboard)

// Reset array on startup
settings.setResetArray(true)

function mainLoop(){
  acronymToSearch = readClipBoard()

  // check if array needs reset
  let reset = settings.getResetArray()
  if(reset === 'true'){
      settings.setResetArray(false)
      if(settings.getActiveList() === 'AllLists'){
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
    icon: iconPath,
    timeoutType: 'default',
  })
}

// Search array for acronym
function searchList(acronymToSearch, array){
  console.log('SEARCHING...')
  let title = '';
  let body = '';

  let i = 1 // each meaning found
  array.forEach(line  => {
    let [acronymInList, meaning] = line.split(/,(.+)/);

    if(acronymInList === acronymToSearch){
      title = acronymInList;
      body = body + i + '. ' + meaning + '\n';
      i++
    }
  });

  return [title, body]
}

function newListIsSelected(){
  console.log('new list...')
  text_path = settings.getFolderPath()
  file = settings.getActiveList()
  console.log('path + file: ' + text_path + '\\' + file)
  acronymArray =  transformTxtToArray(text_path, file)
}

module.exports = { newListIsSelected };

// Array with all lists together
function AllListsToArray(){
  acronymArray = []
  fs.readdir(settings.getFolderPath(), (err, files) => {
    files.forEach(file => {
      if(file.slice(-4, file.length) === EXTENSION){
        console.log("file: " + file)
        arrayTemp = transformTxtToArray(settings.getFolderPath(), file)
        acronymArray = acronymArray.concat(arrayTemp)
      }
    })
  })

}

// Transform txt with acronyms into array
function transformTxtToArray(path, file){
  console.log('New Array created...' + path + '\\' + file)
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

  // Reset List Array with the acronyms
  settings.setResetArray(true)

  sendInfoToMain()
})
