
"use strict";

var events = require('events');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var sprintf = require('sprintf').sprintf;
var util = require('util');

/**
 * MongoDB drive の wrapper クラス
 * @class MongoDB drive の wrapper クラス
 * @param {String} host hostname
 * @param {Number} port port
 * @param {String} dbName database name
 * @param {Object} options 接続オプション
 * @param {Function} callback コールバック関数
 */
var MongoWrapper = function (host, port, dbName, options, callback) {
  events.EventEmitter.call(this);
  var mongoHost = host || 'localhost',
    mongoPort = port || 27017,
    mongoClient,
    url,
    self = this;
  url = sprintf('mongodb://%s:%d/%s', mongoHost, mongoPort, dbName);
  // change options
  options.auto_reconnect = true;
  options.native_parser = true;   // using native bson parser

  MongoClient.connect(url, options, function (err, db) {
    if (err) {
      console.log('DB connect error url=[%s] options=[%s]', url, options);
      console.log(err);
    } else {
	    self.db = db;
	    if (callback) {
	      callback(db);
	    }
	    self.emit('connect');
    }
  });
};

util.inherits(MongoWrapper, events.EventEmitter);

/**
 * ドキュメントの保存
 * @param {String} collectionName コレクション名
 * @param {Object} doc 登録データ
 * @param {Function} callback コールバックファンクション
 * @param {Boolean} update updateの場合はtrue insertは false
 */
MongoWrapper.prototype.save = function (collectionName, doc, callback, update) {
  var self = this;
  self.getCollection(collectionName, function (collection) {
	  if (update) {
	    collection.save(doc, function (err, result) {
        if (err) {
          console.log(err);
        }
        callback(err, result);
      });
	  } else {
	    collection.insert(doc, function (err, result) {
        if (err) {
          console.log(err);
        }
        callback(err, result);
      });
	  }
  });
};

/**
 * ドキュメントの更新
 * @param {String} collectionName コレクション名
 * @param {Object} criteria 条件
 * @param {Object} docs 更新データ
 * @param {Object} opt オプション
 * @param {Function} callback コールバックファンクション
 */
MongoWrapper.prototype.update = function (collectionName, criteria, docs, opt, callback) {
  var self = this;
  self.getCollection(collectionName, function (collection) {
	  collection.update(criteria, docs, opt, function (err, doc) {
      if (err) {
        console.log(err);
      }
      callback(err);
    });
  });
}

/**
 * ドキュメントの削除
 * @param {String} collectionName コレクション名
 * @param {Object} criteria 条件
 * @param {Function} callback コールバックファンクション
 */
MongoWrapper.prototype.remove = function (collectionName, criteria, callback) {
  var self = this;
  self.getCollection(collectionName, function (collection) {
	  collection.remove(criteria, callback);
  });
};

/**
 * ドキュメントの検索
 * @param {String} collectionName コレクション名
 * @param {Object} criteria 条件
 * @param {Function} callback コールバックファンクション
 */
MongoWrapper.prototype.findOne = function (collectionName, criteria, callback) {
  var self = this;
  self.getCollection(collectionName, function (collection) {
	  collection.findOne(criteria, function (err, doc) {
      if (err) {
		console.log(err);
      }
      callback(err, doc);
    });
  });
};

/**
 * ドキュメントの検索
 * @param {String} collectionName コレクション名
 * @param {Object} criteria 条件
 * @param {Object} fields 返却する field 
 * @param {Object} options find オプション
 * @param {Function} callback コールバックファンクション
 * @param {Boolean} array true の場合は配列を返す、false の場合は cursor を返す
 */
MongoWrapper.prototype.find = function (collectionName, criteria, fields, options, callback, array) {
  var self = this;
  self.getCollection(collectionName, function (collection) {
	  if (array) {
	    collection.find(criteria, fields, options).toArray(function (err, doc) {
		    self.errFunc(err);
		    callback(err, doc);
	    });
	  } else {
	    collection.find(criteria, fields, options, function (err, cursor) {
		    self.errFunc(err);
		    callback(err, cursor);
      });
	  }
  });
};

/**
 * インデックス情報返す
 * @param {String} collectionName コレクション名
 * @param {Function} callback コールバックファンクション
 */
MongoWrapper.prototype.indexInformation = function (collectionName, callback) {
  var self = this;
  self.getCollection(collectionName, function (collection) {
    collection.indexInformation(function (err, indexInformation) {
      if (err) {
        console.log(err);
      } else {
        callback(indexInformation);
      }
    });
  });
};

/**
 * インデックスを設定する
 * @param {String} collectionName コレクション名
 * @param {Object} fieldOrSpec インデックス指定子
 * @param {Object} options オプション
 * @param {Function} callback コールバックファンクション
 */
MongoWrapper.prototype.ensureIndex = function (collectionName, fieldOrSpec, options, callback) {
  var self = this;
  self.getCollection(collectionName, function (collection) {
    collection.ensureIndex(fieldOrSpec, options, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback(result);
      }
    });
  });
};

MongoWrapper.prototype.collectionNames = function (collectionName, callback) {
  var self = this;
  self.db.collectionNames(collectionName, {namesOnly: true}, function (err, names) {
    if (err) {
      console.log(err);
    }
    callback(names);
  });
};

/**
 * 指定された collection を削除する
 * @param {String} collectionName コレクション名
 * @param {Function} callback コールバック関数
 * @private
 */
MongoWrapper.prototype.drop = function (collectionName, callback) {
  var self = this;
  console.log('IN: MongoWrapper#drop collectionName=%s', collectionName);
  self.getCollection(collectionName, function (collection) {
    collection.drop(function (err, results) {
      if (err) {
        console.log('MongoWrapper#drop drop collection failed [%s]', collectionName);
        console.log(err);
      } else {
        callback();
      }
    });
  });
};

MongoWrapper.prototype.createCollection = function (collectionName, callback) {
  var self = this;
  console.log('IN: MongoWrapper#createCollection collectionName=[%s]', collectionName);
  self.db.createCollection(collectionName, function (err) {
    if (err) {
      console.log(err);
    }
    callback();
  });
};

/**
 * 指定された collection を取得する
 * @param {String} collectionName コレクション名
 * @param {Function} callback コールバック関数
 * @private
 */
MongoWrapper.prototype.getCollection = function (collectionName, callback) {
  this.db.collection(collectionName, function (err, collection) {
	  if (err) {
      console.log(err);
    } else {
      callback(collection);
    }
  });
};

/**
 * @private
 */
MongoWrapper.prototype.errFunc = function (err) {
  if (err) {
      console.log(err);
  }
};
/**
 * findAndRemove
 * @param {String} collectionName コレクション名
 * @param {Object} query クエリー
 * @param {Object} sort ソート順
 * @param {Function} callback コールバック
 */
MongoWrapper.prototype.findAndRemove = function (collectionName, criteria, sort, callback) {
  var self = this;
  self.getCollection(collectionName, function (collection) {
    collection.findAndRemove(criteria, sort, function (err) {
      if (err) {
        console.log(err);
      }
      callback();
    });
  });
};



/*
MongoWrapper.prototype.findOneById = function (collection, id, callback) {
  var self = this;
  this.db.collection(collection, function (err, collection) {
	  self.errFunc(err);
	  collection.findOne({_id: new ObjectID(id)}, callback);
  });
};
*/
/*
MongoWrapper.prototype.count = function (collection, criteria, callback) {
  var self = this;
  this.db.collection(collection, function (err, collection) {
	  self.errFunc(err);
	  collection.find(criteria, function (err, cursor) {
	    self.errFunc(err);
	    cursor.count(callback);
	  });
  });
};
*/
/*
MongoWrapper.prototype.removeById = function (collection, id, callback) {
  var self = this;
  this.db.collection(collection, function (err, collection) {
	  self.errFunc(err);
	  collection.remove({_id: new ObjectID(id)}, callback);
  });
};
*/
/*
MongoWrapper.prototype.timeStamp = function (callback) {
  callback(new Mongo.Timestamp());
};
*/
/*
MongoWrapper.prototype.distinct = function (collection, fields, criteria, callback) {
  var self = this;
  this.db.collection(collection, function (err, collection) {
	  collection.distinct(fields, criteria, function (err, res) {
	    callback(err, res);
	  });
  });
};
*/
MongoWrapper.prototype.count = function (collection, criteria, callback) {
  var self = this;
  this.db.collection(collection, function (err, collection) {
    self.errFunc(err);
    collection.count(criteria, function (err, count) {
      self.errFunc(err);
      callback(null, count);
    });
  });
};

module.exports = MongoWrapper;
