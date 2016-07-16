const zip = require('../zip');

// zip.compress('./abc.txt', (err, file) => {
//     if(err) throw err;
//     console.log(file);
// });

zip.uncompress('./abc.zip', (err, file) => {
    if(err) throw err;
    console.log(file);
});