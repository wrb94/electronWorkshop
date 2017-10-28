const path = require('path');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const reload = require('electron-reload');
const isDev = require('electron-is-dev');

if (isDev) {
    const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
    reload(__dirname, { electron: electronPath });
}

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1024, height: 800, x: 0, y: 0 });
    mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));

    require('devtron').install();
    // mainWindow.openDevTools();

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});