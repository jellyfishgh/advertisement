const http = require('http');
const fs = requir('fs');
const querystring = require('querystring');
const url = require('url');

const server = http.createServer((req, res) => {
    const urlObj = url.parse(req.url);
    const path = urlObj.path;
    const queryObj = querystring.parse(urlObj.query);
    console.log(`${path}?${urlObj.query}`);
    if(path === '/api/advert'){
        if(queryObj.act === 'get_advert_source' && queryObj.source){
            const rr = fs.createServer(path.join('public', queryObj.source));
            res.writeHead(200, {

            });
            rr.pipe(res);
        }else if(queryObj.act === 'get_advert_image'){

        }
    }else {
        const body = 'no page';
        res.writeHead(404, {
            'Content-Type': 'text/plain',
            'Content-Length': Buffer.byteLength(body)
        });
        res.end(body);
    }
});
server.listen(80, () => {
    console.log(`opened server on ${server.address}`);
});