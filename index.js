import Engine from './class/engine';
import Sensor from './class/sensor';
import config from './config.json';

const http = require('http');

let sensorHelper = new Sensor();

var server = http.createServer(function(req, res) {
    if(req.url === '/favicon.ico') {
        return;
    }

    let engine = new Engine(sensorHelper);
    res.writeHead(200);
    res.end(engine.compute());
});

server.listen(8080);

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.on('get-config', function() {
        socket.emit('get-config', config);
    });

    socket.on('sensor-emit', function(data) {
        sensorHelper.updateData(data);
    });
});