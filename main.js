const { app, Menu, MenuItem, BrowserWindow, Tray, nativeImage } = require('electron')
const fs = require('fs'); // access files
const { ipcMain } = require( "electron" );
const path = require('path')

const isMac = process.platform === 'darwin'
const assetsPath = app.isPackaged ? path.join(process.resourcesPath) : "resources";

const iconPath = path.join(assetsPath, 'img', 'icon.ico')
const icon = nativeImage.createFromPath(iconPath)

const EXTENSION = '.txt'
let lists = []

let browserWindow = null
let contextMenu = new Menu()

// TODO 1. CSS revamp
//      2. Create setup
//      3. Update relative paths so it works with setup

let tray = null
app.whenReady().then(() => {
  CreateHiddenWindow()
  tray = new Tray(icon)
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
      icon: icon,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
       }
    })

    // Load index.html into the new BrowserWindow
    browserWindow.loadFile('./resources/index.html')

    // Open DevTools - Remove for PRODUCTION!
    // browserWindow.webContents.openDevTools();

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

// Necessary to have notifications
function CreateHiddenWindow(){
  optionsWindow = new BrowserWindow({
    height: 500, width: 500,
    show: false, // true for debugging
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
     }
  })
  optionsWindow.loadFile('./resources/hidden.html')
  console.log('Hidden window created...')

  // Open DevTools - Remove for PRODUCTION!
  //optionsWindow.webContents.openDevTools();
}


// REFRESH TRAY MENU

ipcMain.on( "folderPath", ( event, pathAndList) => {
  console.log("folderPath: " + pathAndList)
  let [folderPath, activeList] = pathAndList.split(',')
  console.log(folderPath)
  UpdateTrayMenu(contextMenu, folderPath, activeList)
  console.log("Tray Menu updated")
})

// Read folder and adds to Tray all the lists found
function UpdateTrayMenu(menu, folderPath, activeList){
  // Clean Tray Menu
  menu =  Menu.buildFromTemplate(template)
  let menuList = menu.getMenuItemById('menu')
  // Create All List tray button
  if('AllLists' === activeList){
    console.log('hello1')
    menuList.submenu.append(new MenuItem(
      {label:'All Lists',
        type: 'radio',
        checked: true,
        click: () => ChangeActiveList('AllLists')}))
  }else{
    console.log('hello2')
    menuList.submenu.append(new MenuItem(
      {label:'All Lists',
      type: 'radio',
      checked: false,
      click: () => ChangeActiveList('AllLists')}))
  }
  console.log("READING PATH")
  // Add from folder all lists to Tray Menu
  fs.access(folderPath, function(err) {
    if (err && err.code === 'ENOENT') {
      console.log("path doesnt exist")
    }else{
      fs.readdir(folderPath, (err, files) => {
        console.log(err)
        if(files){
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
        }else{
          console.log("Folder with no files")
        }
      });
    }

  });
  tray.setContextMenu(menu)
}

// ChangeActiveList('hello')
// Handle RADIO tray buttons
function ChangeActiveList(list){
  optionsWindow.webContents.send('saveActiveList', list)
  if(browserWindow !== null){
      browserWindow.webContents.send('saveActiveList', list)
  }
}
