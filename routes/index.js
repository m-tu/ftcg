
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Game demo'});
};

exports.map = function(req, res) {
	res.render('map');
};