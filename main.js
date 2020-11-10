const { app, Menu, MenuItem, BrowserWindow, Tray } = require('electron')
const fs = require('fs'); // access files
const settings = require('./resources/js/settings')
const { ipcMain } = require( "electron" );

const isMac = process.platform === 'darwin'

const EXTENSION = '.txt'
let lists = []

let browserWindow = null
let contextMenu = new Menu()

// TODO 2. (LOW) Write better explanation in Add to List
//      4. (LOW) Max acronym size to settings
//      5. (MEDIUM) Learn More Tab
//      6. (LOW) Redo TRY and CATCH with every and return

let tray = null
app.whenReady().then(() => {
  CreateHiddenWindow()
  tray = new Tray('resources/img/icon.png')
  contextMenu = Menu.buildFromTemplate(template)
  tray.setToolTip('Find your acronym.')
  tray.setContextMenu(contextMenu)
  console.log('Tray created...')
  //readListFolder(contextMenu)
})

let template = [
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
  click() { CreateWindow('LearnMore') }},
  { type: 'separator' },
  isMac ? { role: 'close' } : { role: 'quit' }
]

function CreateWindow(page){
  if(!browserWindow){
      browserWindow = new BrowserWindow({
      height: 600, width: 500,
      resizable: false,
      title: page,
      minimizable: false,
      fullscreenable: false,
      frame: false,
      icon: './resources/img/icon.png',
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
       }
    })

    // Load index.html into the new BrowserWindow
    browserWindow.loadFile('./resources/index.html')

    // Open DevTools - Remove for PRODUCTION!
    browserWindow.webContents.openDevTools();

    // Listen for window being closed
    browserWindow.on('closed',  () => {
      browserWindow = null
    })
    browserWindow.webContents.on('did-finish-load', function() {
      browserWindow.webContents.send('StartingWindow', page)
    });
  }else{
    browserWindow.webContents.send('StartingWindow', page)
    browserWindow.focus()
  }
}

// Necessary tp have notifications
function CreateHiddenWindow(){
  optionsWindow = new BrowserWindow({
    height: 500, width: 500,
    show: true, // true for debugging
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
     }
  })
  optionsWindow.loadFile('./resources/hidden.html')
  console.log('Hidden window created...')

  // Open DevTools - Remove for PRODUCTION!
  optionsWindow.webContents.openDevTools();
}


// REFRESH TRAY MENU

ipcMain.on( "folderPath", ( event, pathAndList) => {
  console.log("Update Tray Menu...")
  let [folderPath, activeList] = pathAndList.split(',')
  UpdateTrayMenu(contextMenu, folderPath, activeList)
  console.log("Tray Menu updated")
})

// Read folder and adds to Tray all the lists found
function UpdateTrayMenu(menu, folderPath, activeList){
  // Clean Tray Menu
  menu =  Menu.buildFromTemplate(template)
  tray.setContextMenu(menu)

  // Add from folder all lists to Tray Menu
  fs.readdir(folderPath, (err, files) => {
    let menuList = menu.getMenuItemById('menu')
    files.forEach(file => {
      if(file.slice(-4, file.length) === EXTENSION){
        if(file === activeList){
          menuList.submenu.append(new MenuItem(
            {label:file.slice(0,-4),
              type: 'radio',
              checked: true,
              click: () => ChangeActiveList(file)}))
        }else{
          menuList.submenu.append(new MenuItem(
            {label:file.slice(0,-4),
              type: 'radio',
              click: () => ChangeActiveList(file)}))
        }
      }
    });
  // lists = files
  });
}
// ChangeActiveList('hello')
// Handle RADIO tray buttons
function ChangeActiveList(list){
  console.log(list)
  optionsWindow.webContents.send('saveActiveList', list)
  if(browserWindow !== null){
      browserWindow.webContents.send('saveActiveList', list)
  }
}
