const { ipcMain } = require('electron');

const Listeners = (window) => {
  ipcMain.on( 'event', (event, arg) => null );
};

module.exports = Listeners;
