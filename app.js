const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const url = require('url');
const mime = require('./mime');
const RouterManager = require('./RouterManager');

const index = require('./router/index');
const api = require('./router/api');

const server = http.createServer((req, res) => {    
    const rm = new RouterManager(req, res);
    rm.register('/', index);
    rm.register('/', index, 'POST');
    rm.register('/api/advert/', api);
    rm.run();
});
server.listen(3000, 'localhost', () => {
    let address = server.address();
    console.log(`opened server on ${address.address}:${address.port}`);
});