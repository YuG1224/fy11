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

/**
 * checkin数表示
 */
exports.checkin = function(req, res){
	var grp = ['ソ','フ','ト','バ','ン','ク','11'];
	
	var data = [
		{
			id: '100003201963303',
			name: 'Hideo Ebina'
		},{
			id: '100001723754289',
			name: 'Takahiro Kato'
		},{
			id: '100000109598680',
			name: 'Yuji Yamaguchi'
		},{
			id: '100003201963303',
			name: 'Hideo Ebina'
		},{
			id: '100001723754289',
			name: 'Takahiro Kato'
		},{
			id: '100000109598680',
			name: 'Yuji Yamaguchi'
		},{
			id: '100003201963303',
			name: 'Hideo Ebina'
		}
	];


	res.render('checkin', {
		title: 'checkin',
		grp: grp,
		pretty: true
	});
};


/**
 * arvhive ページ表示
 */
exports.archive = function(req, res){
	var data = ['DSC00624', 'DSC00642', 'DSC00647', 'DSC00652', 'DSC00654', 'DSC00657', 'DSC00662', 'DSC00666', 'DSC00667', 'DSC00674', 'DSC00676', 'DSC00678', 'DSC00681', 'DSC00684', 'DSC00687', 'DSC00690', 'DSC00692', 'DSC00694', 'DSC00697', 'DSC00699', 'DSC00701', 'DSC00708', 'DSC00713', 'DSC00726', 'DSC00733', 'DSC00737', 'DSC00742', 'DSC00752', 'DSC00754', 'DSC00757', 'DSC00759', 'DSC00763', 'DSC00764', 'DSC00766', 'DSC00768', 'DSC00770', 'DSC00776', 'DSC00779', 'DSC00780', 'DSC00782'];

	res.render('archive', {
		title: 'archive',
		data: data,
		pretty: true
	});
};
