/**
 * Created by martenhennoch on 12/02/14.
 */

var socket = io.connect('http://localhost:3000');
var messages;

socket.on('CONNECT', function (data) {
	console.log("CONNECT");
	console.log(data);
	messages = data;
	intOtherCallBacks();
});

function intOtherCallBacks() {
	socket.on(messages.MAP, function (data) {
		console.log(data);
		startGame(data);
	});
}

$("#startGame").click(function(){
	console.log("Send start game");
	socket.emit(messages.START_GAME, { players: ['Matu', 'Timmu'] });
})

function startGame(config){
	console.log("Game started client side");
	var game = new Game();
	var player_1 = new Player();
	player_1.id = 1;
	player_1.color = "green";
	player_1.node = 4;
	game.addPlayer()
	drawMapNodes(game.board);
}

