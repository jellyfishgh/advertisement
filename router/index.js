const Router = require('../Router');

var router = new Router(
    function (req, res, rm) {
        this.req = req;
        this.res = res;
        this.rm = rm;
        return this;
    }, {
        'GET': function () {
            this.res.writeHead(302, {
                Location: '/api/advert?act=get_advert_source&source=index.html'
            });
            this.res.end();
        }
    }
);

module.exports = router;