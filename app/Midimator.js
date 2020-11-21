import React, {Component} from 'react';
import './midimator.scss';

const ipcRenderer = window.require('electron').ipcRenderer;

class Midimator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      note: 48,
      inputNote: null,
      velocity: 127,
      inputVelocity: null,
      program: 0,
      devices: [],
      selectedDevice: -1,
    }
  }

  componentDidMount() {
    ipcRenderer.on('devices', (event, devices) => {
      this.setState({devices});
    });

    ipcRenderer.on('message', (event, message) => {
      this.parseMessage(message);
    });

    ipcRenderer.on('selectedDevice', (event, device) => {
      if (device !== false) {
        const selectedDevice = parseInt(device);
        this.setState({selectedDevice});
      }
    });

    ipcRenderer.send('getMidiDevices');
    ipcRenderer.send('getSelectedMidiDevice');
  }

  componentWillUnmount() {
    ipcRenderer.send('closePort', this.state.selectedDevice);
    ipcRenderer.removeAllListeners();
  }

  handlePlayNote(note, velocity) {
    ipcRenderer.send('send', [144, note, velocity])
  }

  handlePC(program) {
    if (program >= 0) {
      ipcRenderer.send('send', [192, program])
      this.setState({program})
    }
  }

  handleDeviceSelect(device) {
    const selectedDevice = parseInt(device);
    this.setState({selectedDevice})
    ipcRenderer.send('setMidiDevice', selectedDevice)
  }

  parseMessage(message) {
    switch(message[0]) {
      case 144:
        this.setState({inputNote: message[1], inputVelocity: message[2]})
        break;
      case 192:
        this.setState({program: message[1]})
        break;
    }
  }

  notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

  ccToNote = (cc) => {
    let octave;

    if (cc >= 21 && cc < 24) {
      octave = 0;
    }
    else if (cc >= 24 && cc < 36) {
      octave = 1;
    }
    else if (cc >= 36 && cc < 48) {
      octave = 2;
    }
    else if (cc >= 48 && cc < 60) {
      octave = 3;
    }
    else if (cc >= 60 && cc < 72) {
      octave = 4;
    }
    else if (cc >= 72 && cc < 84) {
      octave = 5;
    }
    else if (cc >= 84 && cc < 96) {
      octave = 6;
    }
    else if (cc >= 96 && cc < 108) {
      octave = 7;
    }
    else if (cc >= 108 && cc < 120) {
      octave = 8;
    }
    else if (cc >= 120 && cc < 128) {
      octave = 9;
    }

    if(!octave) {
      return '';
    }
    return `${this.notes[((cc-21)%12)]}${octave}`
  }

  render() {
    return (
      <div className={'app'}>
        <div className={'container'}>

          {/*Input Status*/}
          <div className={'input-status-container'}>
            <div className={'input-status-item-wrapper'}>
              <p className={'title'}>Last Input Note</p>
              <p>
                <b>{this.ccToNote(this.state.inputNote)}</b>
              </p>
            </div>

            <div className={'input-status-item-wrapper'}>
              <p className={'title'}>Input Velocity</p>
              <p>
                <b>{this.state.inputVelocity}</b>
              </p>
            </div>
          </div>

          {/*Param controls*/}
          <div className={'param-controls-container'}>
            {/*Program*/}
            <div className={'param-control-wrapper'}>
              <div className={'button-wrapper'}>
                <button onClick={() => this.handlePC(this.state.program + 1)}>
                  &uarr;
                </button>
                <button onClick={() => this.handlePC(this.state.program - 1)}>
                  &darr;
                </button>
              </div>

              <div className={'value-wrapper'}>
                <p className={'title'}>PROGRAM</p>
                <p className={'value'}>{this.state.program}</p>
              </div>
            </div>

            {/*Velocity*/}
            <div className={'param-control-wrapper'}>
              <div className={'button-wrapper'}>
                <button onClick={() => this.setState({velocity: this.state.velocity += 1})}>
                  &uarr;
                </button>
                <button onClick={() => this.setState({velocity: this.state.velocity -= 1})}>
                  &darr;
                </button>
              </div>

              <div className={'value-wrapper'}>
                <p className={'title'}>VELOCITY</p>
                <p className={'value'}>{this.state.velocity}</p>
              </div>
            </div>

            {/*Note*/}
            <div className={'param-control-wrapper'}>
              <div className={'button-wrapper'}>
                <button onClick={() => this.setState({note: this.state.note += 1})}>
                  &uarr;
                </button>
                <button onClick={() => this.setState({note: this.state.note -= 1})}>
                  &darr;
                </button>
              </div>

              <div className={'value-wrapper'}>
                <p className={'title'}>NOTE</p>
                <p className={'value'}>{this.ccToNote(this.state.note)}</p>
              </div>

              <div className={'play-button-wrapper'}>
                <button
                  className={'play-button'}
                  onMouseDown={() => this.handlePlayNote(this.state.note, this.state.velocity)}
                  onMouseUp={() => this.handlePlayNote(this.state.note, 0)}
                  onMouseOut={() => this.handlePlayNote(this.state.note, 0)}>
                  &#9654;
                </button>
              </div>
            </div>
          </div>

          {/*Devices*/}
          <div className={'device-controls-container'}>
            <select
              value={this.state.selectedDevice}
              onChange={(e) => this.handleDeviceSelect(e.target.value)}
              onClick={() => ipcRenderer.send('getMidiDevices')}>
              <option disabled value={-1}>Select a midi device</option>
              {
                this.state.devices.map((device, index) => (
                  <option value={index} key={index}>{device}</option>
                ))
              }
            </select>
          </div>

        </div>
      </div>
    );
  }
}

export default Midimator;
