
/*
 * GET users listing.
 */
Player = require('./Player').Player;

exports.list = function(req, res){
	var user = req.session.user;

	if (typeof user === 'undefined') {
		user = new Player();
		req.session.user = user;
	}

	user.inc++;

	res.send("respond with a resource" + user.inc);
};