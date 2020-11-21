const { ipcMain } = require('electron');
const midi = require('./midi');

midi.openPort(0);

const Listeners = (window) => {
  ipcMain.on( 'play', (event, arg) => {
    console.log(arg);
    midi.sendMessage(arg);
  });
};

module.exports = Listeners;
