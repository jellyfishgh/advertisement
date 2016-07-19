const url = require('url');

function RouterManager(req, res) {
    this.req = req;
    this.res = res;
    this.router = {};
}

RouterManager.prototype = {
    constructor: 'RouterManager',
    http_request_method: { 'GET': true, 'HEAD': true, 'POST': true, 'PUT': true, 'DELETE': true, 'TRACE': true, 'CONNECT': true },
    register: function (pathname, route, method) {
        if (!this.router[pathname]) this.router[pathname] = route.init(this.req, this.res, this);
        // if (!(method && http_request_method[method])) {
        //     console.warn(`Invalid Http Request Method: ${method}`);
        //     method = 'GET';
        // }
        // route[method]();
    },
    run: function () {
        const urlObj = url.parse(this.req.url);
        this.direct(urlObj.pathname);
    },
    direct: function (pathname) {        
        const route = this.router[pathname];
        if (route && route.render[this.req.method]) {
            console.log(`${pathname} ${this.req.method}`);
            route.render[this.req.method].apply(route);
        } else {
            this.err();
        }
    },
    err: function () {
        const body = 'no such page';
        this.res.writeHead(404, {
            'Content-Type': 'text/plain',
            'Content-Length': Buffer.byteLength(body)
        });
        this.res.end(body);
    }
}

module.exports = RouterManager;