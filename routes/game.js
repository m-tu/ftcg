/*
 * GET game page.
 */

var Game = require('../engine/Game'),
	Board = require('../engine/Board'),
	Player = require('../engine/Player');

var game = new Game();

// temp hack
var globalPlayerId = 0,
	players = {};

exports.index = function(req, res){
	var playerId = req.session.playerId,
		player;

	if (typeof playerId === 'undefined') {
		playerId = globalPlayerId++;

		player = new Player(playerId);
		req.session.playerId = playerId;
		players[playerId] = player;


		game.addPlayer(player);
	} else {
		player = players[playerId];
	}

	res.send(game.getInfo());

	//res.render('game');
};