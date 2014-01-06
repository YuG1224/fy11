
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: "FY11", pretty: true});
};
