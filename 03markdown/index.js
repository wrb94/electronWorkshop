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
});

function openFile() {
    const files = dialog.showOpenDialog(mainWindow, {
        properties: ['openfile'],
        defaultPath: __dirname,
        filters: [{
            name: 'Markdown files',
            extensions: ['md', 'txt']
        }],
        title: 'Select markdown files',
        buttonLabel: 'Open .md files'
    });

    if (!files) return;
    const file = files[0];
    mainWindow.setTitle(file);
    const content = fs.readFileSync(file).toString();
    mainWindow.webContents.send('file-opened', file, content);
}

function saveFile(content, originalFilePath) {
    let filePath;
    if (!originalFilePath)
        filePath = dialog.showSaveDialog(mainWindow, {
            title: 'Save HTML',
            defaultPath: __dirname,
            filters: [{
                name: 'HTML files',
                extensions: ['html']
            }]
        });
    else {
        if (originalFilePath.endsWith('.md')) filePath = originalFilePath.replace('.md', '.html');
        if (originalFilePath.endsWith('.txt')) filePath = originalFilePath.replace('.txt', '.html');
    }
    if (!filePath) return;
    fs.writeFileSync(filePath, content);
}

module.exports = {
    openFile: openFile,
    saveFile: saveFile
}