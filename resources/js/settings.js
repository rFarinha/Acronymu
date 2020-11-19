const app = require('electron').remote.app
const path = require('path')

// DEFAULTS values for first time startup
let soundState_default = true;
let clipboardRefreshRate_default = 1000 // seconds
let acronymMaxSize_default = 10 // seconds
let listPath_default = ''
let activeList_default = 'AllLists'

//********** FOLDER PATH ***************
let saveFolderPath = exports.saveFolderPath = (path) => {
  localStorage.setItem('listFolder',path)
}

exports.getFolderPath = () => {
  let folderPath = localStorage.getItem('listFolder')
  if(!folderPath){
    if(require('electron').remote.app.isPackaged){
      listPath_default = path.join(process.resourcesPath, 'examples')
    }else{
      listPath_default = path.join(app.getAppPath(),'resources','examples')
    }
    saveFolderPath(listPath_default)
    return listPath_default
  }
  return folderPath
}


//********** ACTIVE LIST ***************
let setActiveList = exports.setActiveList = (list) => {
  localStorage.setItem('activeList', list)
}

exports.getActiveList = (list) => {
  let activeList = localStorage.getItem('activeList')
  if(activeList === null){
    activeList = activeList_default
    localStorage.setItem('activeList', activeList)
  }
  return activeList
}


//*******CLIPBOARD REFRESH RATE *********
exports.setClipboardRefreshRate = (time) => {
  localStorage.setItem('ClipboardRefreshRate', time)
}

exports.getClipboardRefreshRate = () => {
  let time = localStorage.getItem('ClipboardRefreshRate')
  // if there is no local value --> set default value
  if(time === null){
    console.log("default value set for Clipboard Refresh Rate")
    time = clipboardRefreshRate_default
    this.setClipboardRefreshRate(time)
  }
  return Number(time)
}

//********** SOUND STATE ***************
exports.setSoundState = (state) => {
  localStorage.setItem('sound', state)
  console.log('Sound is ' + state)
}

exports.getSoundState = () => {
  let soundState = localStorage.getItem('sound')
  if(soundState === null){
    console.log("default value set for sound state")
    soundState = soundState_default
    this.setSoundState(soundState)
  }
  return soundState.toString() === 'true';
}

//********** MAX ACRONYM SIZE ***************
let setAcronymMaxSize = exports.setAcronymMaxSize = (maxSize) => {
  localStorage.setItem('MaxSize', maxSize)
}

exports.getAcronymMaxSize = () => {
  let maxSize = localStorage.getItem('MaxSize')
  if(maxSize === null){
    maxSize = acronymMaxSize_default
    setAcronymMaxSize(maxSize)
  }
  return maxSize
}

//*********** CLEAR SETTINGS ******************
exports.clearLocalStorage = () => {
  localStorage.clear();
}
