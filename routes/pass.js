var request = require('request');

exports.get = function(req, res){
	console.log('se: ' + JSON.stringify(req.session));
	var id = req.session.passport.user.id;

	request.post({
		url: 'http://createpassbook.cloudapp.net:3000/create',
		form: {
			uid: id,
			serialNumber: 'softbankfy11'
		}
	}, function(err, response, body){
		if(err){
			console.log(err);
			res.send(err, 500);
		}else{
			console.log(body);
			res.redirect('http://createpassbook.cloudapp.net:3000/download?uid=' + id);
		}
	});
};
