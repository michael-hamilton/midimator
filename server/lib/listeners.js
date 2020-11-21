const { ipcMain } = require('electron');
const midi = require('./midi');

const Listeners = (window) => {
  ipcMain.on( 'send', (event, message) => midi.sendMessage(message));
  ipcMain.on( 'closePort', (event, port) => midi.closePort(port));
  ipcMain.on( 'setMidiDevice', (event, port) => midi.openPort(port));

  ipcMain.on( 'getMidiDevices', (event, arg) => {
    const portCount = midi.getPortCount();
    const devices = [];

    for(let port = 0; port < portCount; port++) {
      devices.push(midi.getPortName(port));
    }

    window.webContents.send('devices', devices);
  });
};

module.exports = Listeners;
