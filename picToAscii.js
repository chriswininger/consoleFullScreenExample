Ascii = require('ascii');

console.log('Image: ' + process.argv[2]);

var i = 0;
renderImage();


function renderImage() {
    if (i > 17) i = 0;
    console.log('capture' + i + '.jpg');
    //var pic = new Ascii('capture' + i + '.jpg');
    var pic = new Ascii(process.argv[2]);
    i++;
    // output in terminal (terminal mode)
    pic.convert(function (err, result) {
        if (err) console.error('error: ' + err);
       // process.stdout.write('\033c');
        console.log(result);
       // setTimeout(renderImage, 10);
    });
}

