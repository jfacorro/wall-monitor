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

let windows = [];

const shortcuts = {
  'ctrl+shift+f': toggleFullScreen,
  'ctrl+r': reload,
  'ctrl+o': open,
  'ctrl+alt+j': devTools
};

function init() {
  load(false);

  for(let keys in shortcuts) {
    globalShortcut.register(keys, shortcuts[keys]);
  }
}

function load(requestPath) {
  global.screens = config.load(requestPath);

  if(global.screens === undefined) {
    return app.quit();
  }

  screens.forEach(function(screen, index) {
    windows.push(createWindow(screen, index));
  });

}

function reload() {
  open(true);
}

function open(reload) {
  let oldWindows = windows.slice();

  windows.length = 0;
  load(!reload);

  oldWindows.forEach(function(w) {
    w.close();
  });
}

function devTools() {
  windows.forEach(function(w) {
    w.openDevTools();
  });
}

function toggleFullScreen() {
  windows.forEach(function(w) {
    w.setFullScreen(!w.isFullScreen());
  });
}

function createWindow(screen, index) {
  let display = getDisplay(index);

  let options = {
    title: screen.name || "Wall Monitor",
    x: display.bounds.x,
    y: display.bounds.y,
    width: display.size.width,
    height: display.size.height,
    fullscreen: true,
    frame: false
  };
  let window = new BrowserWindow(options);
  window.loadURL(indexUrl + index);
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
