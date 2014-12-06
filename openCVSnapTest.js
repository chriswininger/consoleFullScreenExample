var cv = require('opencv'),
	es = require('event-stream'),
	fs = require('fs');

var idx = 0;
var cam = new cv.VideoCapture(idx);
var stream = es.readable(function (cnt, cb) {
	var self = this;

	stream.snapshot = function (cb) {
		cam.read(function (err, i) {
			cb(err, i.toBuffer());
		});
	};

	stream.record = function (ms, cb) {
		var vid = [];

		setTimeout(clear, ms);
		stream.on('data', push);

		function clear () {
			stream.removeListener('data', push);
			cb(vid);
		}
		function push (buf) {
			vid.push(buf);
		}
	};

	stream.snapshot (function (err, buf) {
		if (err) self.emit('error', err);
		else self.emit('data', buf);
		cb();
	});
});

stream.on('data', function (buffer) {
	console.log('!!! buffer: ' + buffer.length);
	fs.writeFileSync('camBlah.png',buffer);
	stream.destroy();
	console.log('done!');
});