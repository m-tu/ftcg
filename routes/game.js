/*
 * GET game page.
 */

var Game = require('../engine/Game'),
	Board = require('../engine/Board'),
	Player = require('../engine/Player');

var game = new Game();

// temp hack
var players = {};

var messages = require('../engine/SocketMessages.js');

exports.index = function(io) {
	io.sockets.on('connection', function (socket) {
		var sessionId = socket.handshake.sessionId,
			player = players[sessionId] || null,
			initData = {
				messages: messages, // tell client what socket.messages we accept
				map: game.board.config
			};

		if (player !== null) {
			// already in game
			initData.inGame = true;
		}

		socket.emit('connected', initData);

		socket.on(messages.JOIN_GAME, function (data, callback) {
			console.log('JOIN', data);

			if (player !== null) {
				callback({
					success: false,
					error: 'Already joined'
				});

				return;
			}

			player = game.addPlayer();

			if (player === null) {
				// failed
				callback({
					success: false,
					error: 'Error'
				});
			} else {
				players[sessionId] = player;
				callback({
					success: true,
					data: {
						players: game.getPlayersInfo()
					}
				});
				socket.broadcast.emit('players', game.getPlayersInfo());

			}

			if (initData.inGame) {
				socket.emit('players', game.getPlayersInfo());
			}
		});
	});

	return function(req, res){
		res.render('game');
	};

};



