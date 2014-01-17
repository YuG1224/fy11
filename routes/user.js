'use strict'

var User = require('../model/user');
var user = new User('localhost', 27017, 'fy11');


/**
 * register user 
 * @param {Object}  req http request object
 * @param {Object}  res http response objecs
 * @public
 */
exports.register = function(req, res){
	var userData = req.query;
	user.register(userData, function (err) {
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
exports.addPushToken = function(req, res){
	var pbData = req.query;
	user.addPushToken(pbData, function (err) {
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
exports.accept = function(req, res){
	var data = req.query;
	user.accept(data, function (err) {
		if (!err) {
			res.send(200, 'success!');
			// TODO kick the websocket server (ティザーサイトへのwebsocket依頼)
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
exports.get = function(req, res){
	var data = req.query;
	user.get(data, function (err, data) {
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
exports.delete = function(req, res){
	var data = req.body;
	user.delete(data, function (err) {
		if (!err) {
			res.send(200, 'success!');
		} else {
			res.send(500, err);
		}
	});
};

