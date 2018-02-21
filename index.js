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

    console.log("emitting get-config");
    socket.emit('get-config');

    socket.on('set-config', function(data) {
        configHelper.deviceid = data.device_id;
        configHelper.graph = data.graph;
        var conf = configHelper.getConfig();
        console.log("set config: DEVICE " + data.device_id);
        socket.emit('config-ok', conf);
        configHelper.ready = true;
        console.log("emitting config-ok in mode " + conf.type + " with " + conf.relays.length + " relays");
    });

    socket.on('sensor-emit', function(data) {
        if(configHelper.ready) {
            console.log("sensor-emit: " + data);
            sensorHelper.updateData(data);
            engine.compute();
        }
    });
});