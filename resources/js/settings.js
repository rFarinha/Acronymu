const app = require('electron').remote.app
const path = require('path')

// DEFAULTS values for first time startup
let soundState_default = true;
let sortState_default = true;
let clipboardRefreshRate_default = 1000 // seconds
let acronymMaxSize_default = 10 // seconds
let listPath_default = ''
let activeList_default = 'AllLists'

//********** FOLDER PATH ***************
exports.saveFolderPath = (path) => {
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
    this.saveFolderPath(listPath_default)
    return listPath_default
  }
  return folderPath
}

//********** SORT LIST *****************

exports.setSortState = (state) => {
  localStorage.setItem('sort', state)
  console.log('Sort is ' + state)
}

exports.getSortState = () => {
  let sortState = localStorage.getItem('sort')
  if(sortState === null){
    console.log("default value set for sort state")
    sortState = sortState_default
    this.setSortState(sortState)
  }
  return sortState.toString() === 'true';
}

//********** ACTIVE LIST ***************
exports.setActiveList = (list) => {
  localStorage.setItem('activeList', list)
}

exports.getActiveList = (list) => {
  let activeList = localStorage.getItem('activeList')
  if(activeList === null){
    activeList = activeList_default
    this.setActiveList(activeList)
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
exports.setAcronymMaxSize = (maxSize) => {
  localStorage.setItem('MaxSize', maxSize)
}

exports.getAcronymMaxSize = () => {
  let maxSize = localStorage.getItem('MaxSize')
  if(maxSize === null){
    maxSize = acronymMaxSize_default
    this.setAcronymMaxSize(maxSize)
  }
  return maxSize
}

//*********** CLEAR SETTINGS ******************
exports.clearLocalStorage = () => {
  localStorage.clear();
}

exports.resetSettings = () => {
  this.setSoundState(soundState_default)
  this.setSortState(sortState_default)
  this.setClipboardRefreshRate(clipboardRefreshRate_default)
  this.setAcronymMaxSize(acronymMaxSize_default)
  // default folder path changes depending if app is packaged
  if(require('electron').remote.app.isPackaged){
    listPath_default = path.join(process.resourcesPath, 'examples')
  }else{
    listPath_default = path.join(app.getAppPath(),'resources','examples')
  }
  this.saveFolderPath(listPath_default)
  this.setActiveList('AllLists')
}

//************ ACRONYM ADDED ***************
exports.setResetArray = (reset) => {
  localStorage.setItem('ResetArray', reset)
}

exports.getResetArray = () => {
  let resetArray = localStorage.getItem('ResetArray')
  if(resetArray === null){
    resetArray = false
    this.setResetArray(resetArray)
  }
  return resetArray
}
