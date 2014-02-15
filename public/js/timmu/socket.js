var socket = io.connect('http://localhost:3000'),
	messages,
	game;

socket.on('connected', function (data) {
	messages = data.messages;

	createMap(data.map);

	if (!data.inGame) {
		createJoin();
	}

//	socket.emit(messages.JOIN_GAME);
});

function createJoin() {
	createButton('Join game', function() {
		socket.emit(messages.JOIN_GAME, null, function(data) {
			if (data.success) {
				console.log('Players', data.data.players);
				updatePlayers(data.data.players);
				createStart();
			} else {
				console.log(data.error);
			}
		});
	});
}

function createStart() {

}

socket.on('message', function(data) {
	console.log('message', data);
});

socket.on('players', function(players) {
	updatePlayers(players);
});