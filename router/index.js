const Router = require('../Router');

var router = new Router(
    function (req, res, rm) {
        this.req = req;
        this.res = res;
        this.rm = rm;
    }, {
        'GET': function () {
            this.rm.direct('/api/advert/act=get_get_advert_source&source=index.html');
        },
        'POST': function () {

        }
    }
);

module.exports = router;
