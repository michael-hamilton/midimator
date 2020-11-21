const { app, BrowserWindow } = require('electron');
const server = require('./server');

function createWindow () {
  let window = new BrowserWindow({
    width: 640,
    height: 480,
    webPreferences: {
      contextIsolation: true
    }
  });

  server(window);
  window.loadURL("http://localhost:1234");
}

app.on('ready', createWindow);
