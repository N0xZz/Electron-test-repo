// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const os = require('os')

// set env
process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow
let xlstojsonWindow

function createMainWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: isDev ? 1280 : 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.setMenuBarVisibility(false)
  // autoUpdater
  // Open the DevTools if env = development.
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow()
  autoUpdater.checkForUpdatesAndNotify()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// check app-version
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() })
})

// check if update available
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
})
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
})

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall()
})