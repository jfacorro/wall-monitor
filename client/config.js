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

function load() {
    try {
        fs.statSync(path);
        let config = YAML.load(path);
        return validate(config);
    } catch (e) {
        console.log(e);
        dialog.showErrorBox( "Missing configuration file",
                             "There is no config.yml available in " + path);
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
