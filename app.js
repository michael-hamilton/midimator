const { app, BrowserWindow } = require('electron');
const server = require('./server');

function createWindow () {
  let window = new BrowserWindow({
    width: 750,
    height: 250,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  server(window);
  // window.openDevTools({mode: 'detach'});
  window.loadURL("http://localhost:1234");
}

app.on('ready', createWindow);
