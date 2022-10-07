// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const os = require('os')
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"


let updateInterval = null;

// set env
process.env.NODE_ENV = 'development'

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
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow()

  autoUpdater.autoDownload = false;
  
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
  dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message: 'A update is available. Do you want to update now?',
      buttons: ['Yes', 'No']
  }).then((result) => {
      if (result.response === 0) {
          console.log("Download Update.")
          autoUpdater.downloadUpdate();
      }
  });
})
autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: `A new ${autoUpdater.channel} version has been downloaded. Restart the application to apply the updates.`
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  });
})
