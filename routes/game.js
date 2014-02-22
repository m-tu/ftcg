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
				map: game.board.getConfig()
			};

		if (player !== null) {
			// already in game
			initData.inGame = true;

			player.data.socket = socket;
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

			player = game.addPlayer({socket: socket});

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
				socket.emit('showStart');
			}
		});

		socket.on('start', function() {
			var activePlayer;

			if (game.start()) {
				activePlayer = game.currentPlayer;

				io.sockets.emit('start', {
					players: game.getPlayersInfo(),
					active: activePlayer.id
				});

				activePlayer.data.socket.emit('turn');
			}
		});

		socket.on('rollDice', function(callback) {
			var roll;

			console.log('roll');

			if (!game.isValidPlayer(player)) {
				console.log('not valid player');
				return;
			}

			roll = game.rollDice();

			console.log('roll resut', roll);


			if (roll !== null) {
				io.sockets.emit('roll', roll);
				callback({
					roll: roll,
					nodes: game.getReachableNodes()
				});
			}
		});

		socket.on('move', function(node) {
			var result;

			if (!game.isValidPlayer(player)) {
				console.log('not valid player');
				return;
			}

			result = game.moveTo(node);

			if (result !== null) {
				// successful move
				io.sockets.emit('players', game.getPlayersInfo());

				if (result.canOpen) {
					socket.emit('canOpen', {price: result.price});
				} else {
					socket.emit('endTurn');
				}
			} else {
				console.log('not valid move');
			}
		});

		socket.on('open', function() {
			var node;

			if (!game.isValidPlayer(player)) {
				return;
			}

			node = game.openNode();

			if (node) {
				io.sockets.emit('openNode', node);
				io.sockets.emit('players', game.getPlayersInfo());
				socket.emit('endTurn');
			}
		});

		socket.on('endTurn', function() {
			if (!game.isValidPlayer(player)) {
				return;
			}

			if (!game.endTurn()) {
				return;
			}

			io.sockets.emit('players', game.getPlayersInfo());
			io.sockets.emit('roll', null);
			io.sockets.emit('activePlayer', game.getActivePlayerId());

			game.currentPlayer.data.socket.emit('turn');
		});

		if (initData.inGame) {
			// sync all game data, oeh
			socket.emit('players', game.getPlayersInfo());

			if (!game.started) {
				socket.emit('showStart');
			} else {
				// update info
				socket.emit('roll', game.dice);
				socket.emit('activePlayer', game.getActivePlayerId());

				if (game.currentPlayer === player) {
					if (game.dice === null) {
						socket.emit('turn');
					} else if (!game.hasPlayerMoved) {
						socket.emit('reachableNodes', game.getReachableNodes());
					} else if (player.canOpenNode()) {
						socket.emit('canOpen', {price: player.getNode().getCost()});
					} else {
						socket.emit('endTurn');
					}
				}

			}
		}
	});

	return function(req, res){
		res.render('game');
	};

};



