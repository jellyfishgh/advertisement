const fs = require('fs');
const path = require('path');

module.exports = function (dir, cb) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        files.map((file) => {
            let newDir = path.join(
                path.dirname(dir),
                path.basename(file, path.extname(file))
            );
            fs.stat(newDir, (err, stats) => {
                if (err) fs.mkdirSync(newDir);
                let newFile = path.join(newDir, `${path.basename(dir)}${path.extname(file)}`);
                fs
                    .createReadStream(path.join(dir, file))
                    .pipe(fs.createWriteStream(newFile))
                    .on('error', (err) => {
                        throw err;
                    })
                    .on('finish', () => {
                        cb(newFile);
                    });
            });
        });
    });
};