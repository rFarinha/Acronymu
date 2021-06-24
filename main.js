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


// *********************************************
// ************ CREATE TRAY ********************
// *********************************************
let tray = null
app.whenReady().then(() => {
  CreateHiddenWindow()
  tray = new Tray(icon)
  contextMenu = Menu.buildFromTemplate(template)
  tray.setToolTip('Find your acronym.')
  tray.setContextMenu(contextMenu)
})

// Tray template
let template = [
  { label: app.name, enabled: false },
  { type: 'separator' },
  { label: 'Add to List',
  click() { CreateWindow('AddToList') }}, // This will open window with Add To List Tab open
  { label: 'Create new List',
  click() { CreateWindow('Lists') }}, // This will open window with Lists Tab open
  { type: 'separator' },
  {
    label: 'Lists', id: 'menu',
    // This submenu is dynamic and updated with UpdateTrayMenu() function
    submenu: [
      { label: 'Select a list',
      click() { CreateWindow('Lists') }}, // This will open window with Lists Tab open
      { type: 'separator' },
    ]
  },
  { type: 'separator' },
  { label: 'Settings',
  click() { CreateWindow('Settings') }}, // This will open window with Settings Tab open
  //{label: 'Learn More',
  //click() { CreateWindow('LearnMore') }}, // This will open window with learnMore Tab open
  { type: 'separator' },
  isMac ? { role: 'close' } : { role: 'quit' }
]

// Read folder and adds to Tray all the lists found
function UpdateTrayMenu(menu, folderPath, activeList){
  // Clean Tray Menu
  menu =  Menu.buildFromTemplate(template)
  let menuList = menu.getMenuItemById('menu')

  // Create tray button to select all lists
  menuList.submenu.append(new MenuItem(
    {label:'All Lists',
      type: 'radio',
      checked: 'AllLists' === activeList, // True if alllists is active
      click: () => ChangeActiveList('AllLists')})) // ChangeActiveLists will send new active list to main window and save it in settings

  // Read folder and add tray button for every txt in folder
  fs.access(folderPath, function(err) {
    if (err && err.code === 'ENOENT') {
      console.log("path doesnt exist")
    }else{
      fs.readdir(folderPath, (err, files) => {
        // console.log(err)
        if(files){ // checks if there is any file in folder
          files.forEach(file => {
            if(file.slice(-4, file.length) === EXTENSION){
              menuList.submenu.append(new MenuItem(
                {label:file.slice(0,-4),
                  type: 'radio',
                  checked: file === activeList,
                  click: () => ChangeActiveList(file)})) // ChangeActiveLists will send new active list to main window and save it in settings
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


// REFRESH TRAY MENU
// If folder or active list is changed in main window
// the message "folderPath" is sent with the path to folder and current active list
ipcMain.on( "folderPath", ( event, pathAndList) => {
  let [folderPath, activeList] = pathAndList.split(',')
  UpdateTrayMenu(contextMenu, folderPath, activeList)
})


// Handle RADIO tray buttons
// Send new active list to main window and save it to settings
function ChangeActiveList(list){
  optionsWindow.webContents.send('saveActiveList', list)
  if(browserWindow !== null){
      browserWindow.webContents.send('saveActiveList', list)
  }
}

// *********************************************
// ************ CREATE MAIN WINDOW *************
// *********************************************
function CreateWindow(page){
  // Check if window already created
  // page is the window tab to open
  // When Tray button is pressed, it will call CreateWindow function with corresponding button Tab
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
    browserWindow.webContents.openDevTools();

    // Listen for window being closed
    browserWindow.on('closed',  () => {
      browserWindow = null
    })
    browserWindow.webContents.on('did-finish-load', function() {
      // send message to windowFunctions.js to only show the correct page (Tab) and update html
      browserWindow.webContents.send('StartingWindow', page)
    });
  }else{
    browserWindow.webContents.send('StartingWindow', page)
    browserWindow.focus()
  }
}

// *********************************************
// ************ CREATE HIDDEN WINDOW ***********
// *********************************************
// Window that will read clipboard every X ms
// is associated with clipboard.js
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
  // console.log('Hidden window created...')

  // Open DevTools - Remove for PRODUCTION!
  optionsWindow.webContents.openDevTools();
}
