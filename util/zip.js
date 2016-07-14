const fs = require('fs');
const JSZip = require("jszip");
const zip = new JSZip();

module.exports = {
    compress: function(file, cb) {
        zip
            .generateNodeStream({
                type: 'nodebuffer',
                streamFiles: true
            })
            .pipe(fs.createWriteStream('out.zip'))
            .on('finish', function() {
                console.log("out.zip written.");
            });
    },
    uncompress: function(zipFile, cb) {

    }
};