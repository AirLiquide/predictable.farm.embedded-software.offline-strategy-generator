import Engine from './class/engine';
import Sensor from './class/sensor';
import ConfigHelper from "./class/ConfigHelper";

import config from './config.json';

const LOCAL_ENGINE_PORT = 6500;

let sensorHelper = new Sensor();
let configHelper = new ConfigHelper();
let engine = new Engine(sensorHelper, configHelper);

configHelper.engine = engine;

const io = require('socket.io')(LOCAL_ENGINE_PORT);

io.on('connection', function (socket) {
    engine.setSocket(socket);

    socket.on('set-config', function(data) {
        console.log(data);
        configHelper.deviceid = data.deviceid;
        configHelper.graph = data.graph;
        socket.emit('config-ok', configHelper.getConfig());
    });
    socket.on('sensor-emit', function(data) {
        sensorHelper.updateData(data);
        if(config.env !== 'dev') {
            engine.compute();
        }
    });
});