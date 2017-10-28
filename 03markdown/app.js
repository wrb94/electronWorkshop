const electron = require('electron');
const marked = require('marked');
const ipc = electron.ipcRenderer;

const remote = electron.remote;
const clipboard = remote.clipboard;
const shell = electron.shell;
const mainProcess = remote.require('./index.js');

const $ = selector => document.querySelector(selector);

const rawMarkdown = $('.raw-markdown');
const renderedHtml = $('.rendered-html');
const openFile = $('#open-file');
const copyHtml = $('#copy-html');
const saveFile = $('#save-file');
const saveFileAs = $('#save-file-as');

let fileName;

ipc.on('file-opened', (event, file, content) => {
    fileName = file;
    rawMarkdown.value = content;
    renderMarkdownToHtml(content);
});

function renderMarkdownToHtml(markdown) {
    const html = marked(markdown);
    renderedHtml.innerHTML = html;
}

rawMarkdown.addEventListener('keyup', event => {
    const content = event.target.value;
    renderMarkdownToHtml(content);
});

openFile.addEventListener('click', () => {
    mainProcess.openFile();
});

copyHtml.addEventListener('click', () => {
    const html = renderedHtml.innerHTML;
    clipboard.writeText(html);
});

saveFile.addEventListener('click', () => {
    mainProcess.saveFile(renderedHtml.innerHTML, fileName);
});

saveFileAs.addEventListener('click', () => {
    mainProcess.saveFile(renderedHtml.innerHTML);
});

document.body.addEventListener('click', (event) => {
    if (event.target.matches('a[href^="http"]')) {
        event.preventDefault();
        shell.openExternal(event.target.href);
    }
});