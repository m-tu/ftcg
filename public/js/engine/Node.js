/**
 * Single cell/node on game board
 * @param x {number}
 * @param y {number}
 * @param id {number}
 * @param type {Node.Types}
 * @param players {Player[]} Players on the node
 * @constructor
 */
var Node = function(id, x, y, type) {
	this.id = id;
	this.x = x;
	this.y = y;
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

Node.Colors = {
	BLANK: "black",
	CAT_GIF: "red",
	START: "gray"
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
