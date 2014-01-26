/**
 * arvhive ページ表示
 */
exports.archive = function(req, res){
	var data = ['DSC00624.jpg', 'DSC00666.jpg', 'DSC00687.jpg', 'DSC00708.jpg', 'DSC00754.jpg', 'DSC00770.jpg', 'DSC00642.jpg', 'DSC00667.jpg', 'DSC00690.jpg', 'DSC00713.jpg', 'DSC00757.jpg', 'DSC00776.jpg', 'DSC00647.jpg', 'DSC00674.jpg', 'DSC00692.jpg', 'DSC00726.jpg', 'DSC00759.jpg', 'DSC00778.jpg', 'DSC00652.jpg', 'DSC00676.jpg', 'DSC00694.jpg', 'DSC00733.jpg', 'DSC00763.jpg', 'DSC00780.jpg', 'DSC00654.jpg', 'DSC00678.jpg', 'DSC00697.jpg', 'DSC00737.jpg', 'DSC00764.jpg', 'DSC00782.jpg', 'DSC00657.jpg', 'DSC00681.jpg', 'DSC00699.jpg', 'DSC00742.jpg', 'DSC00766.jpg', 'DSC00662.jpg', 'DSC00684.jpg', 'DSC00701.jpg', 'DSC00752.jpg', 'DSC00768.jpg'];

	res.render('archive', {
		title: 'archive',
		data: data,
		pretty: true
	});
};
