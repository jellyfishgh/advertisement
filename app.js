const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const url = require('url');
const mime = require('./mime');

const server = http.createServer((req, res) => {
    const urlObj = url.parse(req.url);
    const path = urlObj.path;
    const queryObj = querystring.parse(urlObj.query);
    console.log(`${path}?${urlObj.query}`);
    if (path === '/api/advert') {
        const file = queryObj.source ? queryObj.source : queryObj.img;
        const extName = file.slice(file.lastIndexof('.'));
        console.log(extName);        
        res.writeHead(200, {
            'Content-Type': mime[extName] ? mime[extName] : 'text/platin'
        });
        if (queryObj.act === 'get_advert_source' && queryObj.source) {
            const rr = fs.createReadStream(path.join('public', queryObj.source));
            rr.pipe(res);
        } else if (queryObj.act === 'get_advert_image') {
            const rr = fs.createReadStream(path.join('public', `/${queryObj.game}/${queryObj.resolution}/${queryObj.img}`));
        }
        rr.pipe(res);
    } else {
        const body = 'no page';
        res.writeHead(404, {
            'Content-Type': 'text/plain',
            'Content-Length': Buffer.byteLength(body)
        });
        res.end(body);
    }
});
server.listen(3000, 'localhost', () => {
    let address = server.address();
    console.log(`opened server on ${address.address}:${address.port}`);
});