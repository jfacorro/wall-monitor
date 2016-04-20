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

function init() {
  let screens = YAML.load(configPath) || [];
  console.log(screens);
  for(var index = 0; index < screens.length; index++) {
    let screen = screens[index];
    let windows = createWindows(index, screen);
    rotate(windows, screen.rotation);
  }
}

function createWindows(index, screen) {
  let windows = [];
  let display = getDisplay(index);
  for(var i = 0; i < screen.urls.length; i++) {
    let window = createWindow(display, screen.urls[i]);
    windows.push(window);
  }
  return windows;
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

function rotate(windows, every) {
  windows[0].focus();
  // Rotate the array
  windows.push(windows.shift());
  setTimeout(function () { rotate(windows, every); }, every);
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
