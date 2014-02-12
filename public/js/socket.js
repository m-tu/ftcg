/**
 * Created by martenhennoch on 12/02/14.
 */

var socket = io.connect('http://localhost:3000');
var messages;

// some temporary stuff

var Board = function() {
	this.nodes = {};
	this.start = null;
	this.config = Board.CONFIG;
	this.loadConfig(Board.CONFIG);
};

var Node = function(x, y, id, type) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.type = type;
	this.neighbours = [];
	this.players = [];
};

/**
 * Node types
 * @type {Object}
 */
Node.Types = {
	BLANK: 1,
	CAT_GIF: 2,
	START: 3
};

/**
 * Add neighbour to node
 *
 * @param node {Node}
 */
Node.prototype.addNeighbour = function(node) {
	this.neighbours.push(node);
};

/**
 * Move player to node
 *
 * @param player {Player}
 */
Node.prototype.addPlayer = function(player) {
	var previousNode = player.getNode();

	if (previousNode !== null) {
		previousNode.removePlayer(player);
	}

	player.setNode(this);

	this.players.push(player);
};

/**
 * Remove player from node
 *
 * @param player {Player}
 */
Node.prototype.removePlayer = function(player) {
	var index = this.players.indexOf(player);

	if (index !== -1) {
		this.players.splice(index, 1);
	}
};

Board.CONFIG = [
	{id: 1, x: 0, y: 0, type: 1, neighbours: [2]},
	{id: 2, x: 0, y: 0, type: 1, neighbours: [1, 3]},
	{id: 3, x: 0, y: 0, type: 1, neighbours: [2, 4]},
	{id: 4, x: 0, y: 0, type: 3, neighbours: [3]}
];

var conf = Board.CONFIG;

Board.prototype.loadConfig = function(conf) {
	var self = this;

	// create all nodes
	conf.forEach(function(nodeConf) {
		var node = new Node(nodeConf.id, nodeConf.x, nodeConf.y, nodeConf.type);

		self.nodes[nodeConf.id] = node;

		if (node.type === Node.Types.START) {
			self.start = node;
		}
	});

	// add neighbours
	conf.forEach(function(nodeConf) {
		var node = self.nodes[nodeConf.id];

		nodeConf.neighbours.forEach(function(nodeId) {
			var neighbour = self.nodes[nodeId];

			if (typeof neighbour !== 'undefined') {
				node.addNeighbour(neighbour);
			}
		});
	});
};

var board = new Board();

socket.on('CONNECT', function (data) {
	console.log("CONNECT");
	console.log(data);
	messages = data;
	intOtherCallBacks();
});

function intOtherCallBacks() {
	socket.on(messages.MAP, function (data) {
		console.log(data);
		board.loadConfig(data);
		console.log(board);
	});
}

$("#startGame").click(function(){
	console.log("Send start game");
	socket.emit(messages.START_GAME, { players: ['Matu', 'Timmu'] });
})

