const listeners = require('./lib/listeners');

const Server = (window) => {
  window.webContents.once('did-start-loading', async () => {
    console.log('Midimator server starting...');
    listeners(window);
  });
}

module.exports = Server;
