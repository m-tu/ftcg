/**
 * Single Player
 */
var Player = function(id) {
	this.id = id;
	this.color = "black";
	this.node = null;
};

/**
 * Set node of player
 *
 * @param node {Node}
 */
Player.prototype.setNode = function(node) {
	this.node = node;
};

Player.prototype.getNode = function() {
	return this.node;
};
