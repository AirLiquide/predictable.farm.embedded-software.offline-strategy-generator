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
    io = eval('require')('/usr/lib/node_modules/socket.io')(LOCAL_ENGINE_PORT);
    console.log("LOCAL ENGINE STARTED");
} else {
    io = require('socket.io')(LOCAL_ENGINE_PORT);
}

io.on('connection', function (socket) {
    engine.setSocket(socket);
    socket.emit('get-config');

    socket.on('set-config', function(data) {
        configHelper.graph = data.graph;

        if (typeof data.device_id === "string") {
            configHelper.deviceid = data.device_id;
        } else {
            configHelper.deviceid = data.device_id.toString();
        }

        var conf = configHelper.getConfig();

        socket.emit('config-ok', conf);

        configHelper.ready = true;

        if(conf.type === 'server') {
            setTimeout(function() { computeDelay(); }, 5000);
        }
    });

    socket.on('sensor-emit', function(data) {
        if(configHelper.ready) {
            sensorHelper.updateData(data);
        }
    });
});

function computeDelay() {
    engine.compute();
    setTimeout(function() { computeDelay(); }, 5000);
}