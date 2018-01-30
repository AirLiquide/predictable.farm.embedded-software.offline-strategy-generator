const http = require('http');

import Engine from './class/engine';

var server = http.createServer(function(req, res) {
    if(req.url === '/favicon.ico') {
        return;
    }
    let engine = new Engine();
    res.writeHead(200);
    res.end(engine.compute());
});

server.listen(8080, function () {
    // let engine = new Engine();
    // engine.compute()
});