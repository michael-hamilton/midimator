const midi = require('midi');

const MidiLib = {

  output: new midi.Output(),

  getPortCount() {
    return this.output.getPortCount();
  },

  getPortName(port) {
    return this.output.getPortName(port);
  },

  openPort(port) {
    this.output.openPort(port);
  },

  closePort(port) {
    this.output.closePort(port);
  },

  sendMessage(message) {
    this.output.sendMessage(message);
  }

};

module.exports = MidiLib;
