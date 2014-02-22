var socket = io.connect('http://localhost:3000'),
	messages,
	game;

socket.on('connected', function (data) {
	messages = data.messages;

	createMap(data.map);

	if (!data.inGame) {
		createJoin();
	}
});

// temp hack - reload page after socket error
socket.on('error', function() {
	console.log('error');
	location.reload();
});

socket.on('message', function(data) {
	console.log('message', data);
});

socket.on('players', function(players) {
	updatePlayers(players);
});

socket.on('showStart', function() {
	createButton('Start', function() {
		socket.emit('start');
	});
});

socket.on('start', function(data) {
	updatePlayers(data.players);
	updateActivePlayer(data.active);

	document.getElementById('buttons').innerHTML = '';
});

socket.on('turn', function() {
	createButton('Roll dice', function() {
		socket.emit('rollDice', function(data) {
			console.log('i rolled ' + data.roll);

			showMoves(data.nodes, function(node) {
				socket.emit('move', node);
			});
		});
	});
});

socket.on('roll', function(roll) {
	updateRoll(roll);
});

socket.on('activePlayer', function(active) {
	updateActivePlayer(active);
});

socket.on('reachableNodes', function(nodes) {
	showMoves(nodes, function(node) {
		socket.emit('move', node);
	});
});

socket.on('canOpen', function(data) {
	createButton('Open ($' + data.price + ')', function() {
		clearButtons();
		socket.emit('open');
	});
	createEndTurn();
});

socket.on('openNode', function(node) {
	updateNode(node.id, node.secret);
});

socket.on('endTurn', function() {
	createEndTurn();
});



// functions

function createJoin() {
	createButton('Join game', function() {
		socket.emit(messages.JOIN_GAME, null, function(data) {
			if (data.success) {
				console.log('Players', data.data.players);
				updatePlayers(data.data.players);
			} else {
				console.log(data.error);
			}
		});
	});
}

function createEndTurn() {
	createButton('End turn', function() {
		clearButtons();
		socket.emit('endTurn');
	});
}
