const { app, Menu, MenuItem, BrowserWindow, Tray } = require('electron')
const fs = require('fs'); // access files

const isMac = process.platform === 'darwin'
let listsPath = './resources/'
const EXTENSION = '.txt'
let lists = []

let browserWindow = null

//TODO Html for all tabs

let tray = null
app.whenReady().then(() => {
  CreateHiddenWindow()
  tray = new Tray('resources/img/icon.png')
  let contextMenu = Menu.buildFromTemplate(template)
  tray.setToolTip('Find your acronym.')
  tray.setContextMenu(contextMenu)
  readListFolder(contextMenu)
})

const template = [
  { label: app.name, enabled: false },
  { type: 'separator' },
  { label: 'Add to List',
  click() { CreateWindow('AddToList') }},
  {
    label: 'Lists', id: 'menu',
    submenu: [
      { label: 'Create new List',
      click() { CreateWindow('Lists') }},
      { type: 'separator' },
    ]
  },
  { type: 'separator' },
  { label: 'Settings',
  click() { CreateWindow('Settings') }},
  {label: 'Learn More',
  click: async () => {
    const { shell } = require('electron')
    await shell.openExternal('https://electronjs.org')
  }},
  { type: 'separator' },
  isMac ? { role: 'close' } : { role: 'quit' }
]

function readListFolder(menu){
  fs.readdir(listsPath, (err, files) => {
    let menuList = menu.getMenuItemById('menu')
    files.forEach(file => {
      if(file.slice(-4, file.length) === EXTENSION){
        menuList.submenu.append(new MenuItem({label:file.slice(0,-4), type: 'radio'}))
      }
    });
  lists = files});
}


function CreateWindow(page){
  if(!browserWindow){
      browserWindow = new BrowserWindow({
      height: 600, width: 500,
      resizable: false,
      title: page,
      minimizable: false,
      fullscreenable: false,
      frame: false,
      webPreferences: { nodeIntegration: true }
    })

    // Load index.html into the new BrowserWindow
    browserWindow.loadFile('./resources/index.html')

    // Open DevTools - Remove for PRODUCTION!
    //browserWindow.webContents.openDevTools();

    // Listen for window being closed
    browserWindow.on('closed',  () => {
      browserWindow = null
    })
    browserWindow.webContents.on('did-finish-load', function() {
      browserWindow.webContents.send('StartingWindow', page)
    });
  }else{
    browserWindow.webContents.send('StartingWindow', page)
  }
}

// Necessary tp have notifications
function CreateHiddenWindow(){
  optionsWindow = new BrowserWindow({
    height: 1, width: 1,
    show: false,
    webPreferences: { nodeIntegration: true }
  })
  optionsWindow.loadFile('./resources/hidden.html')
}
