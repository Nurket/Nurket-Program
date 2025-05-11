const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const expressApp = require('../app');
const port = 3000;

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadURL(`http://localhost:${port}/`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    expressApp.listen(port, () => {
        console.log(`Express app listening on port ${port}`);
        createWindow();
        Menu.setApplicationMenu(null); // Remove the application menu after the window is created
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