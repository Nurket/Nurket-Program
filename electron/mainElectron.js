const { app, BrowserWindow, screen, Menu } = require('electron');
const path = require('path');
const expressApp = require('../app');
const port = 3000;

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    
  });

  mainWindow.loadURL(`http://localhost:${port}/`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // this removes the top bar / consologe and so on settings in electron for clearer look: For devs keep this not active
//  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  expressApp.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
    createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


// listen to exist event for exit button
const { ipcMain } = require('electron');

ipcMain.on('exit-app', () => {
  app.quit();
});


// saving stuff
ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});