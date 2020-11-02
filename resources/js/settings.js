// DEFAULTS values for first time startup
let soundState_default = true;
let clipboardRefreshRate_default = 1000 // seconds
let listPath_default = 'C:\\Users\\rafarinha\\Projects\\Acronymu\\Acronymu\\resources' // seconds

// Save folder path with all the lists
exports.saveFolderPath = (path) => {
  localStorage.setItem('listFolder',path)
}

// Return folder path saved
exports.getFolderPath = () => {
  let folderPath = localStorage.getItem('listFolder')
  if(folderPath === null){
    return listPath_default
  }
}

exports.setSelectedList = (list) => {
  localStorage.setItem('listSelected', list)
}

exports.getSeletedList = () => {
  return localStorage.setItem('listSelected')
}

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
