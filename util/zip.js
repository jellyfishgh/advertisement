const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

module.exports = {
    compress: function (file, cb) {
        fs.readFile(file, (err, data) => {
            if (err) cb(err, null);
            else {
                let zipFile = `${path.basename(file, path.extname(file))}.zip`;
                new JSZip()
                    .file(file, data)
                    .generateNodeStream({
                        type: 'nodebuffer',
                        streamFiles: true
                    })
                    .pipe(fs.createWriteStream(zipFile))
                    .on('error', (err) => {
                        cb(err, null);
                    })
                    .on('finish', () => {
                        cb(null, zipFile);
                    });
            }
        });
    },
    uncompress: function (zipFile, cb) {
        new JSZip.external.Promise((resolve, reject) => {
            fs.readFile(zipFile, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }).then((data) => {
            new JSZip()
                .folder(path.basename(zipFile, '.zip'))
                .loadAsync(data)
                .then((zip) => {
                    for (let key in zip.files) {
                        zip.files[key]
                            .file(key)
                            .nodeStream()
                            .pipe(fs.createWriteStream(key))
                            .on('finish', () => {
                                console.log(key);
                            });
                    }
                });
        }).catch((err) => {
            cb(err, null);
        });
    }
};