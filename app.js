
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	game = require('./routes/game'),
	http = require('http'),
	path = require('path'),
	Game = require('./engine/Game'),
	Board = require('./engine/Board'),
	Player = require('./engine/Player');

// CONSTANTS
var SESSION_ID_KEY = 'ftcg.sid';

var app = express(),
	cookieParser = express.cookieParser('92180e162bba6c5173bf52076aab388c8588ba7d'),
	sessionStore = new express.session.MemoryStore();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({
	store: sessionStore,
	key: SESSION_ID_KEY
}));
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

io.set('log level', 2);

// allow socket connection only with valid express session
io.configure(function() {
	io.set('authorization', function(data, callback) {
		cookieParser(data, {}, function(err) {
			if (err) {
				callback(null, false);

				return;
			}

			var sessionId = (data.secureCookies && data.secureCookies[SESSION_ID_KEY]) ||
				(data.signedCookies && data.signedCookies[SESSION_ID_KEY]) ||
				(data.cookies && data.cookies[SESSION_ID_KEY]);

			sessionStore.get(sessionId, function(err, session) {
				if (err || !session) {
					callback(null, false);
				} else {

					data.sessionId = sessionId;
					callback(null, true);
				}
			});
		});
	});
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/game', game.index(io));
app.get('/map', routes.map);