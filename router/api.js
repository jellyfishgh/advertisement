const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const mime = require('../mime.js');

const Router = require('../Router');

var router = new Router(
    function (req, res, rm) {
        this.req = req;
        this.res = res;
        this.rm = rm;
        return this;
    }, {
        'GET': function () {
            try {
                const urlObj = url.parse(this.req.url);
                const queryObj = querystring.parse(urlObj.query);
                const file = queryObj.source ? queryObj.source : queryObj.img;
                const extName = file.slice(file.lastIndexOf('.'));
                this.res.writeHead(200, {
                    'Content-Type': mime[extName] ? mime[extName] : 'text/platin'
                });
                let rr;
                if (queryObj.act === 'get_advert_source' && queryObj.source) {
                    rr = fs.createReadStream(path.join(`${__dirname}/../public`, queryObj.source));
                } else if (queryObj.act === 'get_advert_image') {
                    console.log('get image');
                    rr = fs.createReadStream(path.join(`${__dirname}/../public`, `/${queryObj.game}/${queryObj.resolution}/${queryObj.img}`));
                }
                rr.on('error', (err) => {
                    console.log(err);
                    this.rm.err();
                });
                rr.pipe(this.res);
            } catch (e) {
                this.rm.err();
            }
        },
        'POST': function () {
            const arr = [];
            let len = 0;
            this.req.on('data', (chunk) => {
                arr.push(chunk);
                len += chunk.length;
            });
            this.req.on('end', () => {
                const buffer = Buffer.concat(arr, len);
                this.res.writeHead('200', {
                    'Content-Type': 'text/plain',
                    'Content-Length': buffer.length
                });
                this.res.end(buffer);
            });
        }
    }
);

module.exports = router;