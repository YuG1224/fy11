'use strict'

var User = require('../model/user');
var mongo = new User('localhost', 27017, 'fy11');
// TODO websocket serverを初期化
/*
var RedisSession = require('connect-redis')(express);
var redis = new RedisSession({
		host:'localhost',
		port: 6379,
		secret:'secret'
	});
*/
var user = function (io) {
	mongo.socket(io);
	this.sockets = [];
};

/**
 * register user 
 * @param {Object}  req http request object
 * @param {Object}  res http response objecs
 * @public
 */
user.prototype.register = function(req, res){
	var userData = req.query;
	mongo.register(userData, function (err) {
		if (!err) {
			res.send(200, 'success!');
		} else {
			res.send(500, err);
		}
	});
};
/**
 * add passbook token
 * @param {Object}  req http request object
 * @param {Object}  res http response object
 * @public
 */
user.prototype.addPushToken = function(req, res){
	var pbData = req.body;
	mongo.addPushToken(pbData, function (err) {
		if (!err) {
			res.send(200, 'success!');
		} else {
			res.send(500, err);
		}
	});
};

/**
 * accept user into fy11 party
 * @param {Object}  req http request object
 * @param {Object}  res http response object
 * @public
 */
user.prototype.accept = function(req, res){
	var data = req.query;
	mongo.accept(data, function (err, data) {
		if (!err) {
			// kick the websocket server (ティザーサイトへのwebsocket依頼)
			// param user id + user name			
			var data = {
				id: data.uid,
				name: data.userName
			};
			mongo.emit(data);
			res.send(200, 'success!');
		} else {
			res.send(500, err);
		}
	});
};
/**
 * get user 
 * @param {Object}  req http request object
 * @param {Object}  res http response object
 * @public
 */
user.prototype.get = function(req, res){
	var data = req.query;
	mongo.get(data, function (err, data) {
		if (!err) {
			res.send(200, data);
		} else {
			res.send(500, err);
		}
	});
};

/**
 * delete user 
 * @param {Object}  req http request object
 * @param {Object}  res http response object
 * @public
 */
user.prototype.delete = function(req, res){
	var data = req.body;
	mongo.delete(data, function (err) {
		if (!err) {
			res.send(200, 'success!');
		} else {
			res.send(500, err);
		}
	});
};

module.exports = user;
