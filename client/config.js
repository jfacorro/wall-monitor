'use strict';

const electron = require('electron');
// FileSystem
const fs = require('fs');
// Module to control dialogs.
const dialog = electron.dialog;

// YAML parsers
const YAML = require('yamljs');

// Config path
const path = __dirname + '/config.yml';

module.exports = {
    load: load,
    save: save
};

function load(requestPath) {
    var configPath = path;
    if(requestPath || !fileExists(configPath)) {
        configPath = openDialog();
    }
    console.log('Loading file from: ' + configPath);
    let config = YAML.load(configPath);
    if(validate(config) != undefined) {
        return config;
    }
};

function save(config) {
    let configStr = YAML.stringify(config);
    fs.writeFileSync(path, configStr);
};

function validate(config) {
    let displays = electron.screen.getAllDisplays();
    if (config.length <= displays.length) {
        return config;
    }
    dialog.showErrorBox( "Invalid configuration",
                         "There are no displays available for all the screens specified."
                       );
};

function fileExists(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (e) {
        return false;
    }
};

function copy(origin, target) {
    fs.createReadStream(origin).pipe(fs.createWriteStream(target));
};

function openDialog() {
    let opts = {
        filters: [{name: 'Configuration', extensions: ['yml']}],
        properties: ['openFile']
    };
    let selected = dialog.showOpenDialog(opts);
    if(selected == undefined || selected.length == 0) {
        return openDialog();
    }
    return selected[0];
};
