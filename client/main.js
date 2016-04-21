'use strict';

const electron = require('electron');
// YAML parsers
const YAML = require('yamljs');
// FileSystem
const fs = require('fs');
// Global Shortcuts
const globalShortcut = require('global-shortcut');

// Module to control application life.
const app = electron.app;
// Module to control dialogs.
const dialog = electron.dialog;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Config path
const configPath = __dirname + '/config.yml';
// Index page
const indexUrl = 'file://' + __dirname + '/app/index.html?screen=';

global.screens = [];

function loadConfig() {
  try {
    fs.statSync(configPath);
    let config = YAML.load(configPath);
    return validateConfig(config);
  } catch (e) {
    dialog.showErrorBox("Missing configuration file", "There is no config.yml available in " + configPath);
    app.quit();
  }
}

function validateConfig(config) {
  let displays = require('screen').getAllDisplays();
  if (config.length <= displays.length) {
    return config;
  }
  dialog.showErrorBox("Invalid configuration", "There are no displays available for all the screens specified.");
  app.quit();
}

function init() {
  global.screens = loadConfig();

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
