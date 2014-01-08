
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log('se: ' + JSON.stringify(req.session));
	res.render('index', {title: "FY11", pretty: true});
};
