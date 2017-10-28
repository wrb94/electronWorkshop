const electron = require('electron');
const marked = require('marked');
const ipc = electron.ipcRenderer;

const $ = selector => document.querySelector(selector);

const rawMarkdown = $('.raw-markdown');
const renderedHtml = $('.rendered-html');

ipc.on('file-opened', (event, file, content) => {
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