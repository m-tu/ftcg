
/**
 * Module dependencies.
 */

var express = require('express');
	routes = require('./routes'),
	user = require('./routes/user'),
	game = require('./routes/game'),
	http = require('http'),
	path = require('path'),
	messages = require('./engine/SocketMessages.js');
	Game = require('./engine/Game'),
	Board = require('./engine/Board'),
	Player = require('./engine/Player');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('92180e162bba6c5173bf52076aab388c8588ba7d'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
	socket.emit('CONNECT', messages); //tells client what socket.messages we accept
	socket.on(messages.START_GAME, function (data) {
		socket.emit(messages.MAP, startGame(data));
	});
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/game', game.index);

//not quite sure what to do, just send config for now
function startGame(info){
	var game = new Game();
	return game.board.config;
}


