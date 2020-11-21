const midi = require('midi');

const MidiLib = {

  input: new midi.Input(),
  output: new midi.Output(),
  inputPort: null,
  outputPort: null,

  getPortCount() {
    return this.output.getPortCount();
  },

  getPortName(port) {
    return this.output.getPortName(port);
  },

  openPort(port) {
    this.input.openPort(port);
    this.output.openPort(port);
    this.inputPort = port;
    this.outputPort = port;
  },

  closePort(port) {
    this.input.closePort(port);
    this.output.closePort(port);
    this.inputPort = null;
    this.outputPort = null;
  },

  sendMessage(message) {
    this.output.sendMessage(message);
  },

  setInputHandler() {
    this.input.on('message', this.handler)
  },
};

module.exports = MidiLib;
