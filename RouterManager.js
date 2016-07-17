function RouterManager(req, res) {
    this.req = req;
    this.res = res;
    this.router = {};
}

RouterManager.prototype = {
    constructor: 'RouterManager',
    http_request_method: { 'GET': true, 'HEAD': true, 'POST': true, 'PUT': true, 'DELETE': true, 'TRACE': true, 'CONNECT': true },
    register: function (path, route, method) {
        if (!this.router[path]) this.router[path] = route.init(this.req, this.res, this);
        if (!(method && http_request_method[method])) {
            console.warn(`Invalid Http Request Method: ${method}`);
            method = 'GET';
        }
        route.render(method);
    },
    run: function () {
        const urlObj = url.parse(this.req.url);
        this.direct(urlObj.path);
    },
    direct: function (path) {
        const route = this.router[path];
        if (route && route.render[req.method]) {
            route.render[req.method]();
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