import React, {Component} from 'react';
import './midimator.scss';

const ipcRenderer = window.require('electron').ipcRenderer;

class Midimator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      note: 48,
      velocity: 127,
      program: 0,
      devices: []
    }
  }

  componentDidMount() {
    ipcRenderer.on('devices', (event, devices) => {
      this.setState({devices});
    });
    ipcRenderer.send('getMidiDevices');
  }

  componentWillUnmount() {
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

  handleDeviceSelect(e) {
    ipcRenderer.send('setMidiDevice', this.state.devices.indexOf(e.target.value))
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
    else {
      octave = '';
    }

    return `${this.notes[((cc-21)%12)]}${octave}`
  }

  render() {
    return (
      <div className={'container'}>

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
        </div>

        {/*Play*/}
        <div>
          <button
            className={'play-button'}
            onMouseDown={() => this.handlePlayNote(this.state.note, this.state.velocity)}
            onMouseUp={() => this.handlePlayNote(this.state.note, 0)}
            onMouseOut={() => this.handlePlayNote(this.state.note, 0)}>
            &#9654;
          </button>
        </div>

        {/*Devices*/}
        <div>
          <select onChange={this.handleDeviceSelect.bind(this)} onClick={() => ipcRenderer.send('getMidiDevices')}>
            <option disabled selected>Select device</option>
            {
              this.state.devices.map(device => (
                <option>{device}</option>
              ))
            }
          </select>
        </div>

      </div>
    );
  }
}

export default Midimator;
