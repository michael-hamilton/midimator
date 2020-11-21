const { ipcMain } = require('electron');
const midi = require('./midi');

const Listeners = (window) => {
  ipcMain.on( 'send', (event, arg) => midi.sendMessage(arg));
  ipcMain.on( 'setMidiDevice', (event, arg) => midi.openPort(arg));

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
