var Canvas = require('canvas');
var ascii = require('./node_modules/ascii/lib/ascii.js');
var fs = require('fs');
var spawn = require('child_process').spawn;
var blessed = require('blessed');

// Create a screen object
var screen = blessed.screen();
var stream = spawn(__dirname + '/bin/imagesnap', ['-t', '0.03', '-']).stdout;

var bufs = [];
stream.on('data', function (chunk){
    var eof = chunk.toString('ascii').indexOf('ENDOFILE');
    if (eof >= 0) {
        bufs.push(chunk.slice(0, eof));
        render(Buffer.concat(bufs));

        bufs = [chunk.slice(eof + 8)];
    } else {
        bufs.push(chunk);
    }
});
stream.on('end', function () {
   //console.log('done');
});

function render(buffer) {
    try {
        //console.log('rendering: ' + require('util').inspect(buffer));
        var pic = new Canvas.Image;
        var newWidth = 1000;
        var newHeight = 900;
        pic.src = buffer;
        var cv = new Canvas(newWidth, newHeight);
        var ctx = cv.getContext('2d');
        ctx.drawImage(pic, 0, 0, newWidth, newHeight);

        box.setContent(ascii.init('cli', ctx, pic, newWidth, newHeight));
        screen.render();
        //process.stdout.write('\033c')
        //console.log(ascii.init('cli', ctx, pic, newWidth, newHeight));
    } catch (ex) {
        console.log('error: ' + ex);
    }
}

// create box to display hello world
var box = blessed.box({
    top: 'center',
    left: 'center',
    width: '900',
    height: '900',
    content: 'Rendering...',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: '#f0f0f0'
        }
    }
});

// add box to screen
screen.append(box);
// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();