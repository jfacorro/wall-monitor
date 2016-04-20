'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// YAML parsers
const YAML = require('yamljs');
// Config path
const configPath = __dirname + '/config.yml';
// Index page
const indexUrl = 'file://' + __dirname + '/web/index.html?screen=';

global.screens = [];

function init() {
  global.screens = YAML.load(configPath) || [];

  for(var index = 0; index < screens.length; index++) {
    let screen = screens[index];
    screen.id = index;
    createWindow(screen);
  }
}

function createWindow(screen) {
  let windows = [];
  let display = getDisplay(screen.id);

  let options = {
    x: display.bounds.x,
    y: display.bounds.y,
    frame: false
  };
  let window = new BrowserWindow(options);
  window.loadURL(indexUrl + screen.id);
  window.maximize();
  window.setFullScreen(true);
}

function getDisplay(index) {
  let screen = require('screen');
  let displays = screen.getAllDisplays();
  if (index < displays.length) {
    return displays[index];
  }
  throw "Not enough displays available!";
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', init);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});
