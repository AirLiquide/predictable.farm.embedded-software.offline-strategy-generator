import Engine from './class/engine';
import Sensor from './class/sensor';
import ConfigHelper from "./class/ConfigHelper";

const LOCAL_ENGINE_PORT = 6500;

let sensorHelper = new Sensor();
let configHelper = new ConfigHelper();
let engine = new Engine(sensorHelper, configHelper);

configHelper.engine = engine;

let io = {};

if(CONTEXT === 'linino') {
    io = require('/usr/lib/node_modules/socket.io')(LOCAL_ENGINE_PORT);
} else {
    io = require('socket.io')(LOCAL_ENGINE_PORT);
}

io.on('connection', function (socket) {
    engine.setSocket(socket);

    socket.emit('get-config');

    socket.on('set-config', function(data) {
        configHelper.deviceid = data.deviceid;
        configHelper.graph = data.graph;
        socket.emit('config-ok', configHelper.getConfig());
    });

    socket.on('sensor-emit', function(data) {
        sensorHelper.updateData(data);
        engine.compute();
    });
});