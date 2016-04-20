'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// YAML parsers
const YAML = require('yamljs');
// Config path
const configPath = "config.yml";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let windows;

function init() {
  windows = [];
  let config = YAML.load(configPath) || {screens : []};
  console.log(config);
  for(var index = 0; index < config.screens.length; index++) {
    createWindows(index, config.screens[index]);
    // rotateWindows();
  }


}

function createWindows(index, urls) {
  let display = getDisplay(index);

  for(var i = 0; i < urls.length; i++) {
    let window = createWindow(display, urls[i]);
    windows.push(window);
  }
}

function createWindow(display, url) {
  let options = {
    x: 0,
    y: 0,
    width: display.size.width,
    height: display.size.height,
    fullscreen: true,
    frame: false
  };
  let window = new BrowserWindow(options);
  window.loadURL(url);
  return window;
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
