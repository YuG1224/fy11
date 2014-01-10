
/*
 * Get home page.
 */

exports.index = function(req, res){
	console.log('se: ' + JSON.stringify(req.session));

	var passport = req.session.passport;
	var id = '';
	var name = '';

	if(passport && passport.user){
		id = passport.user.id; 
		name =passport.user.displayName;
		console.log('ps: ' + id);
		console.log('nm: ' + name);
	}

	res.render('index', {
		title: "FY11",
		id: id,
		name: name,
		pretty: true
	});
};
