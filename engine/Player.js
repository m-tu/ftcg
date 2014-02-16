/**
 * Single Player
 *
 * @param {number} id
 * @param {object} data Custom data related to user
 */
var Player = function(id, data) {
	this.id = id;
	this.node = null;
	this.data = data || {};
};

/**
 * Set node of player
 *
 * @param node {Node}
 */
Player.prototype.setNode = function(node) {
	this.node = node;
};

/**
 * @return {Node|null}
 */
Player.prototype.getNode = function() {
	return this.node;
};

/**
 * @return {number|null}
 */
Player.prototype.getNodeId = function() {
	return this.node === null ? null : this.node.id;
};

module.exports = Player;