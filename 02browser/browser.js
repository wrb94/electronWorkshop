const back = document.getElementById('back');
const forward = document.getElementById('forward');
const home = document.getElementById('home');
const reload = document.getElementById('reload');
const form = document.getElementById('location-form');
const location = document.getElementById('location');
const webview = document.querySelector('webview');
const homeUrl = 'http://devwarsztaty.pl';

form.onsubmit = (e) => {
    e.preventDefault();
    const url = location.value;
    webview.src = url;
};

forward.onclick = () => {
    webview.goForward();
};

back.onclick = () => {
    webview.goBack();
};

reload.onclick = () => {
    webview.reload();
};

home.onclick = () => {
    location.value = homeUrl;
    webview.src = homeUrl;
};