var Canvas = require('canvas');
var ascii = require('./node_modules/ascii/lib/ascii.js');
var fs = require('fs');
var spawn = require('child_process').spawn;
var blessed = require('blessed');

// Create a screen object
var screen = blessed.screen();
var stream = spawn('python', [__dirname + '/testCam.py']).stdout;

var bufs = [];
var i = 0;
stream.on('data', function (chunk){
	console.log('chunk (' + (i++) + ')');
	//console.log(chunk.toString());
	bufs.push(chunk);
});
stream.on('end', function () {
	console.log('done');
	render(Buffer.concat(bufs));
});

function setPixel (image,x,y,c) {
	var index = (x + y * image.width) * 4;
	image.data[index+0] = c[0];
	image.data[index+1] = c[1];
	image.data[index+2] = c[2];
	image.data[index+3] = 255;
}

function render(buffer) {
    try {
		// 614400
        //console.log('rendering: ' + require('util').inspect(buffer));
        var pic = new Canvas.Image;
        var newWidth = 640;
        var newHeight = 480;

		console.log('Buffer: ' + buffer.length + '; sample: ' + buffer[0]);

		// yuyv
		var pixelsRGB = yuv422ToRBG(buffer);


		//console.log('!!! rgb: ' + JSON.stringify(pixelsRGB));

        //pic.src = buffer;
		// ctx.drawImage(pic, 0, 0, newWidth, newHeight);
        var cv = new Canvas(newWidth, newHeight);
		var ctx = cv.getContext('2d');
		var pic = ctx.createImageData(newWidth, newHeight);
		for (var y = 0; y < pixelsRGB.length; y++) {
			for (var x = 0; x < pixelsRGB[y].length; x++) {
				//console.log(x + ',' + y);
				//setPixel(pic,x,y,[255,0,0]);
				setPixel(pic, x, y, pixelsRGB[y][x]);
			}
		}
		ctx.putImageData(pic, 0, 0);
		console.log('!!! width: ' + pic.width);
        box.setContent(ascii.init('cli', ctx, pic, newWidth, newHeight));
        screen.render();
        //process.stdout.write('\033c')
        //console.log(ascii.init('cli', ctx, pic, newWidth, newHeight));
    } catch (ex) {
        console.log('error: ' + ex);
    }
}

function clamp (a, b, x) {
	return Math.max(a, Math.min(x, b));
}
function yuv422ToRBG (buffer) {
	var rgb = [];

	var u, y1, v, y2, r, g, b;
	var rowCount = 0;
	var colCount = 0;
	for (var i = 0; i < (buffer.length-4); i+=4) {
		var u = buffer[i],
			y1 = buffer[i + 1],
			v = buffer[i + 2],
			y2 = buffer[i + 3],
			r1 = Math.floor(clamp(0, 255,  y1+1.402*(v-128))),
			g1 = Math.floor(clamp(0, 255, y1 - 0.344*(u - 128) - 0.714*(v-128))),
			b1 = Math.floor(clamp(0, 255, y1 + 1.722*(u-128))),
			r2 = Math.floor(clamp(0, 255,  y2+1.402*(v-128))),
			g2 = Math.floor(clamp(0, 255, y2 - 0.344*(u - 128) - 0.714*(v-128))),
			b2 = Math.floor(clamp(0, 255, y2 + 1.722*(u-128)));


			rgb[colCount] = rgb[colCount] || [];
			rgb[colCount].push([r1,g1,b1],[r2,g2,b2]);
			rowCount += 2;

			if (rowCount >= 640) {
				rowCount = 0;
				colCount += 1;
			}
	}

	return rgb;
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