'use strict'

var crypto = require('crypto');
var MongoWrapper = require('../lib/mongo_wrapper');
var async = require('async');

/**
 * user class
 * @class	every user uses 1 class
 */
var User = function (host, port, db) {
	this.mongo = new MongoWrapper(host, port, db, {});
	this.col = 'user';
	this.sockets = [];
};

/**
 * register user data
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.register = function (data, callback) {
	var authentication, saveData;
	authentication = this.makeHashVal(data.uid);
	// add user name
	saveData = {
		uid : data.uid,
		authentication : authentication,
		userName : data.name,
		accept : false,
		oauth : 'facebook',
		registerTime : new Date()
	};
	// mongodb access
	this.mongo.save(
		this.col,
		saveData,
		function (err) {
			callback(err);
		}
	);
};

/**
 * add passbook token
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.addPushToken = function (data, callback) {
	var query, updateData, options, passData;
	query = {
		authentication : data.authentication
	};
	passData = {
		deviceLibraryID: data.deviceLibraryID,
		passTypeID: data.passTypeID,
		serialNumber: data.serialNumber,
		pushToken: data.pushToken,
		authentication: data.authentication
	};
	updateData = {
		$set : passData
	};
	options = {
		multi: true
	};
	this.mongo.update(
		this.col,
		query,
		updateData,
		options,
		function (err) {
			callback(err);
		}
	);
};

/**
 * accept user into fy11 party
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.accept = function (data, callback) {
	var query, updateData, options;
	var self = this;
	query = {
		uid : data.uid
	};
	updateData = {
		$set : {
			accept : true,
			acceptTime : new Date()
		}
	};
	options = {
		multi: true
	};
	this.mongo.update(
		this.col,
		query,
		updateData,
		options,
		function (err) {
			if (!err) {
				self.mongo.findOne(
					self.col,
					query,
					function (err, data) {
						callback(err, data);
					}
				);
			} else {
				callback(err);
			}
		}
	);
};

/**
 * find user
 * @param {Objsct}  query  query 
 * @param {Objsct}  fields  fields to return
 * @param {Objsct}  options  query options
 * @param {Objsct}  sort  sort option
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.find = function (query, fields, options, sort, callback) {
	this.mongo.find(
		this.col,
		query,
		fields,
		options,
		sort,
		function (err, data) {
			callback(err, data);
		},
		true
	);
};
/**
 * findOne user
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.findOne = function (data, callback) {
	var query = {
		authentication : data.authentication
	};
	this.mongo.findOne(
		this.col,
		query,
		function (err, data) {
			console.log(data);
			callback(err, data);
		}
	);
};

/**
 * delete user
 * @param {Objsct}  data  user data
 * @param {Function}  callback  callbackFunction
 * @public
 */
User.prototype.delete = function (data, callback) {
	var query = {
		authentication : data.authentication
	};
	this.mongo.remove(
		this.col,
		query,
		function (err) {
			callback(err);
		}
	);
};

/**
 * make hash with crypto
 * @param {String} data hash化する文字列
 * @return {String} hashval hash値
 * @private
 */
User.prototype.makeHashVal = function (data) {
  var hashval = crypto.createHash('md5').update(data).digest('hex');
  return hashval;
};
module.exports = User;
