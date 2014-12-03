var fs = require('fs');
var camera = require('camera');

var webcam = camera.createStream(0);
webcam.on('error', function (err) {
	console.log('error: ' + err);
});

webcam.on('data', function (buffer) {
	fs.writeFileSync('cam3.png', buffer);
	webcam.destroy();
});

