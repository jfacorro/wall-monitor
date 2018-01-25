'use strict';

const http = require("http");
const YAML = require('yamljs');
const HttpDispatcher = require("httpdispatcher");

const dispatcher = new HttpDispatcher();

const PORT = 8080;

module.exports = {
    start: start
};

function start() {
  var server = http.createServer(handler);
  server.listen(PORT);
};

function handler (req, res) {
    try {
        console.log(req.url);
        dispatcher.dispatch(req, res);
    } catch(err) {
        console.log(err);
    }
};

dispatcher.onGet("/", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello world!');
});

dispatcher.onPost("/load", function(req, res) {
    try {
        let main   = require("./main");
        let config = YAML.parse(req.body);

        main.saveAndLoadConfig(config);
        res.writeHead(204, {'Content-Type': 'text/plain'});
    } catch (err) {
        console.log(err);
        res.writeHead(400, {'Content-Type': 'text/plain'});
    }
    res.end();
});
