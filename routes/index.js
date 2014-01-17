var request = require('request');
var async = require('async');
var crypto = require('crypto');

/**
 * index ページ表示
 */
exports.index = function(req, res){
	console.log('se: ' + JSON.stringify(req.session));

	var passport = req.session.passport;
	var id = '';
	var name = '';
	var save = false;

	async.waterfall([
		function(cb){
			if(passport && passport.user){
				id = passport.user.id;
				name = passport.user.displayName;
				console.log('ps: ' + id);
				console.log('nm: ' + name);
			}
			cb();
		},
		function(cb){
			if(id && name){
				var authentication = crypto.createHash('md5').update(id).digest('hex');
				
				request.get({
					url: 'http://localhost:3000/getUser',
					qs: {
						authentication: authentication
					}
				}, function(err, response, body){
					if(body){
						save = true;
					}
					cb();
				});
			}else{
				cb();
			}
		},
		function(cb){
			if(id && name && save == false){
				request.post({
					url: 'http://localhost:3000/registerUser',
					qs: {
						uid: id,
						name: name
					}
				}, function(err, response, body){
					cb();
				});
			}else{
				cb();
			}
		}
	], function(err, data){
		res.render('index', {
			title: "FY11",
			id: id,
			name: name,
			pretty: true
		});
	});
};
