const url = require('url');
const querystring = require('querystring');

const Router = require('../Router');

var router = new Router(
    function (req, res, rm) {
        this.req = req;
        this.res = res;
        this.rm;
    }, {
        'GET': function () {
            try {
                const urlObj = url.parse(this.req.url);
                const pathname = urlObj.pathname;
                const queryObj = querystring.parse(urlObj.query);
                const file = queryObj.source ? queryObj.source : queryObj.img;
                const extName = file.slice(file.lastIndexOf('.'));
                res.writeHead(200, {
                    'Content-Type': mime[extName] ? mime[extName] : 'text/platin'
                });
                let rr;
                if (queryObj.act === 'get_advert_source' && queryObj.source) {
                    rr = fs.createReadStream(path.join('../public', queryObj.source));
                } else if (queryObj.act === 'get_advert_image') {
                    rr = fs.createReadStream(path.join('../public', `/${queryObj.game}/${queryObj.resolution}/${queryObj.img}`));
                }
                rr.pipe(res);
            }
            catch (e) {
                this.rm.err();
            }
        }
    }
);

module.exports = router;