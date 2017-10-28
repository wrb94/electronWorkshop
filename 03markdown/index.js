const { app, BrowserWindow, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let content;

app.on('window-all-closed', function () {
    app.quit();
});

app.on('ready', function () {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

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
    content = fs.readFileSync(file).toString();
    mainWindow.webContents.send('file-opened', file, content);
}

function saveFile(content, originalFilePath) {
    if (!content) return;
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

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open...',
                accelerator: 'CmdOrCtrl+O',
                click() { openFile() }
            },
            {
                label: 'Save...',
                accelerator: 'CmdOrCtrl+S',
                click() {
                    saveFile(content);
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            }
        ]
    },
    {
        label: 'Developer',
        submenu: [
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin'
                    ? 'Alt+Command+I'
                    : 'Ctrl+Shift+I',
                click() { mainWindow.webContents.toggleDevTools() }
            }
        ]
    }
]