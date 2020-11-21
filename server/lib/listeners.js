const { ipcMain } = require('electron');
const midi = require('./midi');

const Listeners = (window) => {
  ipcMain.on( 'send', (event, message) => midi.sendMessage(message));
  ipcMain.on( 'closePort', (event, port) => midi.closePort(port));
  ipcMain.on( 'setMidiDevice', (event, port) => {
    midi.openPort(port)
    midi.input.on('message', (delta, message) => {
      window.webContents.send('message', message);
    });
  });

  ipcMain.on( 'getMidiDevices', () => {
    const portCount = midi.getPortCount();
    const devices = [];

    for(let port = 0; port < portCount; port++) {
      devices.push(midi.getPortName(port));
    }

    window.webContents.send('devices', devices);
  });

  ipcMain.on( 'getSelectedMidiDevice', (event, arg) => {
    const port = midi.outputPort == null ? -1 : midi.outputPort;
    window.webContents.send('selectedDevice', port);
  });
};

module.exports = Listeners;
