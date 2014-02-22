/**
 * Single cell/node on game board
 * @param {object} config
 * @param {number} config.id
 * @param {number} config.x
 * @param {number} config.y
 * @param {Node.Types} config.type
 * @constructor
 */
var Node = function(config) {
	this.id = config.id;
	this.x = config.x;
	this.y = config.y;
	this.type = config.type;
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
 * @param {Player} player
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
 * @param {Player} player
 */
Node.prototype.removePlayer = function(player) {
	var index = this.players.indexOf(player);

	if (index !== -1) {
		this.players.splice(index, 1);
	}
};

module.exports = Node;