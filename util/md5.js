const fs = require('fs');
const crypto = require('crypto');

module.exports = function(file, cb){
    const rr = fs.createReadStream(file);    
    rr.on('error', (err) => {
        cb(err, null);
    });
    const md5Hash = crypto.createHash('md5');
    rr.on('data', (d) => {
        md5Hash.update(d);
    });
    rr.on('end', () => {
        cb(null, md5Hash.digest('hex'));
    });
};