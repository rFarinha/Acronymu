const { app, Menu, MenuItem, Tray } = require('electron')
const fs = require('fs'); // access files

const isMac = process.platform === 'darwin'
let listsPath = './resources/'
const EXTENSION = '.txt'
let lists = []


// TODO: Read txt files and add to List Menu

let tray = null
app.whenReady().then(() => {
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
  { label: 'Options', },
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


/*const TrayWindow = require("electron-tray-window");

const { ipcMain, Tray, app, BrowserWindow } = require("electron");
const path = require("path");

app.on("ready", () => {
TrayWindow.setOptions({
  trayIconPath: path.join("resources/icon.png"),
  windowUrl: `file://${path.join(__dirname, "index.html")}`,
  width: 290,
  height: 320
});
});
*/
