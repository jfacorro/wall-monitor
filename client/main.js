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
const server = require('./server');

// Index page
const indexUrl = 'file://' + __dirname + '/app/index.html?screen=';

global.screens = [];

let windows = [];

const shortcuts = {
  'ctrl+shift+f': toggleFullScreen,
  'ctrl+r': load,
  'ctrl+o': open,
  'ctrl+alt+j': devTools
};

module.exports = {
  saveAndLoadConfig: saveAndLoadConfig
};

function init() {
  load();

  for(let keys in shortcuts) {
    globalShortcut.register(keys, shortcuts[keys]);
  }

  server.start();
};

// Save and load a configuration object
function saveAndLoadConfig(configObj) {
  config.save(configObj);

  let oldWindows = windows.slice();
  windows.length = 0;

  global.screens = configObj;
  global.screens.forEach(function(screen, index) {
    windows.push(createWindow(screen, index));
  });

  oldWindows.forEach(function(w) {
    w.close();
  });
};

// Load a configuration from a file or reload the current config
// when a file is specified.
function load(maybeFilePath) {
  saveAndLoadConfig(config.load(maybeFilePath));
};

// Show user an open file dialog
function open() {
  load(true);
};

function devTools() {
  windows.forEach(function(w) {
    w.openDevTools();
  });
};

function toggleFullScreen() {
  windows.forEach(function(w) {
    w.setFullScreen(!w.isFullScreen());
  });
};

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
};

function getDisplay(index) {
  let screen = require('screen');
  let displays = screen.getAllDisplays();
  return displays[index];
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', init);

// Quit when all windows are closed.
app.on('window-all-closed', app.quit);
