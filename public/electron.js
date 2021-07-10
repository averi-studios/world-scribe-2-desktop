const { app, BrowserWindow } = require('electron');
const { ipcMain, dialog, shell } = require('electron');
const isDev = require('electron-is-dev');   
const { autoUpdater } = require('electron-updater');
const path = require('path');
const os = require('os');
const fs = require('fs');

const ElectronStore = require('electron-store');
const electronStore = new ElectronStore();

const enableAutoUpdate = electronStore.get('enableAutoUpdate');

const packageJson = require('../package.json');

// Start the backend API server.
const electronLog = require('electron-log');
const corsAllowList = ['http://localhost:49001']
require('world-scribe-2-server')(corsAllowList, electronLog.functions);
 
let mainWindow;
 
function createWindow() {
    mainWindow = new BrowserWindow({
        width:1920,
        height:1080,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    const startURL =  isDev ? 'http://localhost:49001' : `file://${path.join(__dirname, '../build/index.html')}`;
 
    mainWindow.loadURL(startURL);
 
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.on('ready', () => {
    createWindow();
    if (enableAutoUpdate) {
        autoUpdater.checkForUpdatesAndNotify();
    }
});
if (enableAutoUpdate) {
    autoUpdater.on('update-available', (err) => {
        electronLog.log('Update available');
    });
    autoUpdater.on('update-not-available', (err) => {
        electronLog.log('Update not available');
    });
    autoUpdater.on('error', (err) => {
        electronLog.log('Error occurred while updating:')
        electronLog.log(err);
    });
}

ipcMain.on('get-app-version', (event, arg) => {
    const appVersion = app.getVersion();
    event.reply('get-app-version-result', appVersion);
});

ipcMain.on('get-electron-user-data-path', (event, arg) => {
    const userDataPath = app.getPath('userData');
    event.reply('get-electron-user-data-path-result', userDataPath);
});

ipcMain.on('electron-store-get', (event, entryName) => {
    const storedValue = electronStore.get(entryName);
    event.reply('electron-store-get-result', storedValue);
});

ipcMain.on('electron-store-get-multiple', (event, entryNames) => {
    const storedValues = {};
    for (const entryName of entryNames) {
        storedValues[entryName] = electronStore.get(entryName);
    }
    event.reply('electron-store-get-multiple-result', storedValues);
});

ipcMain.on('electron-store-set', (event, keysToNewValues) => {
    try {
        for (key in keysToNewValues) {
            const newValue = keysToNewValues[key];
            electronStore.set(key, newValue);
        }
        event.reply('electron-store-set-success');
    } catch (err) {
        event.reply('electron-store-set-error', err);
    }
});

ipcMain.on('select-folder', (event, arg) => {
    const filePaths = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
    event.sender.send('select-folder-result', JSON.stringify(filePaths));
});

ipcMain.on('open-file-path', (event, path) => {
    shell.openPath(path);
});

ipcMain.on('file-path-exists', (event, filePath) => {
    const filePathExists = fs.existsSync(filePath);
    event.sender.send('file-path-exists-result', filePathExists);
});

ipcMain.on('open-app-log-file-in-folder', (event, arg) => {
    let logFileFolderPath;
    if (os.platform() === 'win32') {
        logFileFolderPath = `${process.env.USERPROFILE}\\AppData\\Roaming\\${packageJson.name}\\logs\\main.log`;
    }
    else if (os.platform() === 'darwin') {
        logFileFolderPath = `${process.env.HOME}/Library/Logs/${packageJson.name}/main.log`;
    }
    else {
        logFileFolderPath = `${process.env.HOME}/.config/${packageJson.name}/logs/main.log`;
    }

    if (fs.existsSync(logFileFolderPath)) {
        shell.showItemInFolder(logFileFolderPath);
        event.sender.send('open-app-log-file-in-folder-result', {
            succeeded: true,
        });
    }
    else {
        event.sender.send('open-app-log-file-in-folder-result', {
            succeeded: false,
            message: 'Log file does not exist. It might not have been created yet. Keep using the app and then try again later.',
        });
    }
});

ipcMain.on('quit-app', (event, arg) => {
    var canQuitApp = true;

    // TODO: Set canQuitApp to false if there are processes that can't be stopped.

    if (canQuitApp) {
        app.exit(0);
    }
});
