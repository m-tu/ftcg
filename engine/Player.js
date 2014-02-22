var SpecialNode = require('./SpecialNode');
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
	this.money = 0;
};

/**
 * Set node of player
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

/**
 * Set money of player
 * @param {number} money
 */
Player.prototype.setMoney = function(money) {
	this.money = money;
};

/**
 * Add money to player
 * @param {number} amount
 */
Player.prototype.addMoney = function(amount) {
	this.money += amount;
};

/**
 * Check if player can open node they are visiting
 * @return {boolean} True if can open node, false on failure
 */
Player.prototype.canOpenNode = function() {
	return this.node !== null && this.node instanceof SpecialNode && !this.node.isOpened()
		&& this.node.getCost() <= this.money;
};

/**
 * Open current node
 */
Player.prototype.openNode = function() {
	if (this.canOpenNode()) {
		this.money -= this.node.getCost();
		this.node.open();
	}
};

module.exports = Player;