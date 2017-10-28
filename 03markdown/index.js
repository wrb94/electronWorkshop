const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.on('window-all-closed', function () {
    app.quit();
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({ width: 1024, height: 768 });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    require('devtron').install()

    mainWindow.webContents.on('did-finish-load', () => {
        openFile();
    });
});

function openFile() {
    const files = dialog.showOpenDialog(mainWindow, {
        properties: ['openfile'],
        filters: [{
            name: 'Markdown files',
            extensions: ['md', 'txt']
        }],
        title: 'Select markdown files',
        buttonLabel: 'Open .md files'
    });

    if (!files) return;
    const file = files[0];
    const content = fs.readFileSync(file).toString();
    mainWindow.webContents.send('file-opened', file, content);
}