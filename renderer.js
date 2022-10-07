// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron')
const version = document.getElementById('version');
const isMac = process.platform === 'darwin' ? true : false
      
ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
  ipcRenderer.removeAllListeners('app_version');
  version.innerText = 'Version ' + arg.version;
});


document.getElementById("openProgram").addEventListener("click", openProgram);

function openProgram(){
  if (isMac) {
    var executablePath1 = "C:\\Users\\C5265546\\AppData\\Local\\Programs\\electron-test-repo\\electron-test-repo.exe";
  }
  if (!isMac) {
    var executablePath1 = "C:\\Users\\C5265546\\AppData\\Local\\Programs\\electron-test-repo\\electron-test-repo.exe";
  }
  document.getElementById("openProgram").classList.add('hidden');
  window.openApp(executablePath1);
}