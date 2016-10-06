const url = require('url');

function RouterManager(req, res) {
    this.req = req;
    this.res = res;
    this.router = {};
}

RouterManager.prototype = {
    constructor: 'RouterManager',
    register: function (pathname, route) {
        if (!this.router[pathname]) this.router[pathname] = route.init(this.req, this.res, this);
    },
    run: function () {
        const urlObj = url.parse(this.req.url);
        this.direct(urlObj.pathname);
    },
    direct: function (pathname) {
        const route = this.router[pathname];
        if (route && route.render[this.req.method]) {
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
};

module.exports = RouterManager;