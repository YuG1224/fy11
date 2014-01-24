var User = require('../model/user');
/**
 * websocket manager  class
 * @class	every user uses 1 class
 */
var Socket = function () {
	this.mongo = new User('localhost', 27017, 'fy11');
	this.sockets = [];
	this.randomNum = 0;
	this.randomParam = ['authorization','deviceLibraryID','passTypeID','pushToken','registerTime','serialNumber'];
};
Socket.prototype.socket = function (io) {
	var self = this;
	io.sockets.on('connection', function (socket) {
		self.sockets.push(socket);
		socket.on('first', function () {
			self.first(socket);
		});
		socket.on('random', function () {
			self.random(socket);
		});
	});
};

Socket.prototype.emitMulti = function (data) {
	var self = this;
	if (self.sockets.length > 0) {
		self.sockets.forEach(function (socket) {
			socket.json.emit('user', data);
		});
	}
};


Socket.prototype.first = function (socket) {
	var query = {
		accept:true,
		//acceptTime : {$gt: new Date('2014/1/25 17:00:00')}
	};
	this.mongo.find(query, {uid:1,userName:1}, {}, {'acceptTime':1}, function (err, data) {
		data.forEach(function (d) {
			socket.json.emit('user', d);
		});
	});
};

Socket.prototype.random = function (socket) {
	var query = {
		accept:true,
		//acceptTime : {$gt: new Date('2014/1/25 17:00:00')}
	};
	var sort = {};
	sort[this.randomParam[this.randomNum % 5]] = 1;
	this.randomNum++;
	this.mongo.find({accept:true}, {uid:1,userName:1}, {}, sort, function (err, data) {
		data.forEach(function (d) {
			socket.json.emit('user', d);
		});
	});
};

module.exports = Socket;
