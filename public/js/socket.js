/**
 * Created by martenhennoch on 12/02/14.
 */


var socket = io.connect('http://localhost:3000'),
		messages,
		game,
		board;


socket.on('CONNECT', function (data) {
	messages = data;
	intOtherCallBacks();
});

function intOtherCallBacks() {
	socket.on(messages.MAP, function (data) {
		startGame(data);
	});
}

$("#startGame").click(function(){
	//socket.emit(messages.START_GAME, { players: ['Matu', 'Timmu'] });
	startGame();
});

function startGame(){
	console.log("Game started client side");
 	game = new Game();
	board = game.board;
	var player_1 = new Player();
	player_1.id = 1;
	player_1.color = "red";

	var player_2 = new Player();
	player_2.id = 2;
	player_2.color = "pink";

	var player_3 = new Player();
	player_3.id = 3;
	player_3.color = "purple";

	var player_4 = new Player();
	player_4.id = 4;
	player_4.color = "blue";

	game.addPlayer(player_1);
	game.addPlayer(player_2);
	game.addPlayer(player_3);
	game.addPlayer(player_4);

	draw();
}

$("#dice").click(function(){
	rollDice(1, 6);
	if(game !== 'undefined') {
		console.log("move");
//		mainCtx.clearRect(5,5, 300, 300)
		game.board.nodes[8].addPlayer(game.players[1]);
//		game.board.nodes[2].addPlayer(game.players[0])

//		drawMap(game.board);
	}
});


function draw(){
	mainCtx.clearRect(5,5, w, h);
	requestAnimFrame(draw);
	drawMap(board);
}
