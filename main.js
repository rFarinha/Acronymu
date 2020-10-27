const { app, Menu, Tray } = require('electron')

const isMac = process.platform === 'darwin'

// TODO: Read txt files and add to List Menu

let tray = null
app.whenReady().then(() => {
  tray = new Tray('resources/icon.png')
  let contextMenu = Menu.buildFromTemplate(template)
  tray.setToolTip('Find your acronym.')
  tray.setContextMenu(contextMenu)
})

const template = [
  { label: app.name, enabled: false },
  { type: 'separator' },
  { label: 'Add to List' },
  {
    label: 'Lists',
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
