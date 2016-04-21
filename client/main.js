'use strict';

const electron = require('electron');
// YAML parsers
const YAML = require('yamljs');
// FileSystem
const fs = require('fs');

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
    return YAML.load(configPath);
  } catch (e) {
    dialog.showErrorBox("Missing configuration file", "There is no config.yml available in " + configPath);
    app.quit();
  }
}

function init() {
  global.screens = loadConfig();

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
    width: display.size.width,
    height: display.size.height,
    fullscreen: true,
    frame: false
  };
  let window = new BrowserWindow(options);
  window.loadURL(indexUrl + screen.id);
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
