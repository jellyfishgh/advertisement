const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const mime = require('../mime.js');

const Router = require('../Router');

var router = new Router(
    function(req, res, rm) {
        this.req = req;
        this.res = res;
        this.rm = rm;
        return this;
    }, {
        'GET': function() {
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
        'POST': function() {
            console.log('#################');
            Object.keys(this.req.headers).map((key) => {
                console.log(`${key}: ${this.req.headers[key]}`);
            });
            console.log('#################');
            const arr = [];
            let len = 0;
            this.req.on('data', (chunk) => {
                arr.push(chunk);
                len += chunk.length;
            });
            this.req.on('end', () => {
                const buffer = Buffer.concat(arr, len);
                let contentType = this.req.headers['content-type'];
                if (contentType === 'application/json') {
                    this.res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Content-Length': buffer.length
                    });
                    this.res.end(buffer);
                } else if (contentType === 'application/x-www-form-urlencoded') {
                    let str = decodeURIComponent(buffer.toString());
                    this.res.writeHead(200, {
                        'Content-Type': 'text/plain',
                        'Content-Length': Buffer.byteLength(str)
                    });
                    this.res.end(str);
                } else if (contentType.indexOf('multipart/form-data') > -1) {
                    // 当使用 multipart/form-data 时会生成 boundary
                    // eg: content-type: multipart/form-data; boundary=----WebKitFormBoundaryxJ2khgH2wLijgb7m
                    this.res.writeHead(200, {
                        'Content-Type': 'text/plain',
                        'Content-Length': buffer.length
                    });
                    this.res.end(buffer);
                }
            });
        }
    }
);

module.exports = router;
