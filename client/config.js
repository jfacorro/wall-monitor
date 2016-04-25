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
    load: load
};

function load(requestPath) {
    var configPath = path;
    if(requestPath || !fileExists(configPath)) {
        configPath = open();
    }
    console.log('Loading file from: ' + configPath);
    let config = YAML.load(configPath);
    if(validate(config) != undefined) {
        if(configPath != path) {
            copy(configPath, path);
        }
        return config;
    }
}

function validate(config) {
    let displays = require('screen').getAllDisplays();
    if (config.length <= displays.length) {
        return config;
    }
    dialog.showErrorBox( "Invalid configuration",
                         "There are no displays available for all the screens specified."
                       );
}

function fileExists(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

function copy(origin, target) {
    fs.createReadStream(origin).pipe(fs.createWriteStream(target));
}

function open() {
    let opts = {
        filters: [{name: 'Configuration', extensions: ['yml']}],
        properties: ['openFile']
    };
    let selected = dialog.showOpenDialog(opts);
    if(selected == undefined || selected.length == 0) {
        return open();
    }
    return selected[0];
}
