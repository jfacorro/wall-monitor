'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Global Shortcuts
const globalShortcut = require('global-shortcut');
// Configuration
const config = require('./config');

// Index page
const indexUrl = 'file://' + __dirname + '/app/index.html?screen=';

global.screens = [];

function init() {
  global.screens = config.load();

  if(global.screens === undefined) {
    return app.quit();
  }

  let windows = [];

  for(var index = 0; index < screens.length; index++) {
    let screen = screens[index];
    screen.id = index;
    windows.push(createWindow(screen));
  }

  globalShortcut.register('ctrl+shift+f', function () {
    windows.forEach(function(w) {
      w.setFullScreen(!w.isFullScreen());
    });
  });
}

function createWindow(screen) {
  let windows = [];
  let display = getDisplay(screen.id);

  let options = {
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.size.width,
    height: display.size.height,
    fullscreen: true,
    frame: false
  };
  let window = new BrowserWindow(options);
  window.loadURL(indexUrl + screen.id);
  return window;
}

function getDisplay(index) {
  let screen = require('screen');
  let displays = screen.getAllDisplays();
  return displays[index];
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', init);

// Quit when all windows are closed.
app.on('window-all-closed', app.quit);
