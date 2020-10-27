const { app, Menu, MenuItem, BrowserWindow, Tray } = require('electron')
const fs = require('fs'); // access files

const isMac = process.platform === 'darwin'
let listsPath = './resources/'
const EXTENSION = '.txt'
let lists = []


// TODO: Read txt files and add to List Menu

let tray = null
app.whenReady().then(() => {
  CreateHiddenWindow()
  tray = new Tray('resources/icon.png')
  let contextMenu = Menu.buildFromTemplate(template)
  tray.setToolTip('Find your acronym.')
  tray.setContextMenu(contextMenu)
  readListFolder(contextMenu)
})

const template = [
  { label: app.name, enabled: false },
  { type: 'separator' },
  { label: 'Add to List' },
  {
    label: 'Lists', id: 'menu',
    submenu: [
      { label: 'Create new List'},
      { type: 'separator' },
    ]
  },
  { type: 'separator' },
  { label: 'Options',
  click() { CreateOptionsWindow('options') }},
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


function CreateOptionsWindow(page){
  optionsWindow = new BrowserWindow({
    height: 300, width: 270,
    resizable: false,
    title: page,
    minimizable: false,
    fullscreenable: false,
    frame: false,
    webPreferences: { nodeIntegration: true }
  })

  // Load index.html into the new BrowserWindow
  optionsWindow.loadFile(listsPath + page + '.html')

  // Open DevTools - Remove for PRODUCTION!
  //optionsWindow.webContents.openDevTools();

  // Listen for window being closed
  optionsWindow.on('closed',  () => {
    optionsWindow = null
  })
}

// Necessary tp have notifications
function CreateHiddenWindow(){
  optionsWindow = new BrowserWindow({
    height: 1, width: 1,
    show: false,
    webPreferences: { nodeIntegration: true }
  })
  optionsWindow.loadFile(listsPath + 'index.html')
}
