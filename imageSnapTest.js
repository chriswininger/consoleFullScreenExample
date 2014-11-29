// imagesnap is just a wrapper around http://iharder.sourceforge.net/current/macosx/imagesnap/
var imagesnap = require('imagesnap');

var Canvas = require('canvas');
var ascii = require('./node_modules/ascii/lib/ascii.js');
var fs = require('fs');
//var imageStream = fs.createWriteStream('capture' + i++ + '.jpg');
//imagesnap().pipe(imageStream);

render();
function render() {
    var stream = imagesnap();
    var i = 0;
    var bufs = [];
    stream.on('data', function(chunk) {
        //body += chunk;
        bufs.push(chunk);
        i++;
    });
    stream.on('end', function () {
        var t = 'cli';
        var buffer = Buffer.concat(bufs);
        console.log('done: ' + i + '\n' + require('util').inspect(buffer));
        var pic = new Canvas.Image;
        var newWidth = 400;
        var newHeight = 500;
        pic.src = buffer;
        var cv = new Canvas(newWidth, newHeight);
        var ctx = cv.getContext('2d');
        ctx.drawImage(pic, 0, 0, newWidth, newHeight);

        process.stdout.write('\033c')
        console.log(ascii.init(t, ctx, pic, newWidth, newHeight));
        console.log('!!! i: ' + i);
        setTimeout(render, 100);
    });
}


/*
var Camelot = require('camelot');

var camelot = new Camelot( {
    'rotate' : '180',
    'flip' : 'v'
});

camelot.on('frame', function (image) {
    console.log('frame received!');
});

camelot.on('error', function (err) {
    console.log(err);
});

camelot.grab( {
    'title' : 'Camelot',
    'font' : 'Arial:24',
    'frequency' : 1
});
*/
