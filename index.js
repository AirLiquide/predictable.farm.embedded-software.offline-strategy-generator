import Engine from './class/engine';
import Sensor from './class/sensor';
import ConfigHelper from "./class/ConfigHelper";

import config from './config.json';

const http = require('http');

let sensorHelper = new Sensor();
let configHelper = new ConfigHelper();
let engine = new Engine(sensorHelper, configHelper);

configHelper.engine = engine;

var server = http.createServer(function(req, res) {
    if(config.env === 'dev') {
        if(req.url === '/favicon.ico') {
            return;
        }

        res.writeHead(200);
        res.end(engine.compute());
    }
});

server.listen(8080);

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.on('set-config', function(data) {
        console.log(data);
        configHelper.deviceid = data.deviceid;
        configHelper.graph = data.graph;
        socket.emit('config-ok', configHelper.getConfig());
    });
    socket.on('sensor-emit', function(data) {
        sensorHelper.updateData(data);
        //engine.compute();
    });
});