const { app, BrowserWindow } = require('electron');
const server = require('./server');

function createWindow () {
  let window = new BrowserWindow({
    width: 750,
    height: 150,
    minHeight: 150,
    minWidth: 750,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  server(window);
  if (process.env.NODE_ENV === 'development') {
    window.openDevTools({mode: 'detach'});
    window.loadURL('http://localhost:1234');
  }
  else {
    window.loadFile(`dist/index.html`);
  }
}

app.on('ready', createWindow);
