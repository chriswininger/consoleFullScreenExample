var fs = require('fs');
var camera = require('camera');
var Canvas = require('canvas');
var ascii = require('./node_modules/ascii/lib/ascii.js');
var fs = require('fs');
var spawn = require('child_process').spawn;
var blessed = require('blessed');

// Create a screen object
var screen = blessed.screen();
// init cam
var webcam = camera.createStream();

webcam.on('error', function (err) {
	console.log('error reading data', err)
});

webcam.on('data', function (buffer) {
	render(buffer);
	//fs.writeFileSync('camStuff23.jpeg', buffer);
	//console.log('once');
	//webcam.destroy();
});

webcam.snapshot(function (err, buffer){});
webcam.record(1000, function (buffers){});



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
	webcam.destroy();
	return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();