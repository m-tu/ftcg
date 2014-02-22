var CONFIG = require('./CONFIG'),
	Node = require('./Node');

/**
 * Node that can be opened and hides some secret
 * @param {object} config
 * @constructor
 */
var SpecialNode = function(config) {
	Node.call(this, config);

	this.opened = false;
	this.cost = CONFIG.OPEN_COST;
	this.secret = '=^.^=';
};

SpecialNode.prototype = Object.create(Node.prototype);

/**
 * Check if node is opened
 * @return {boolean}
 */
SpecialNode.prototype.isOpened = function() {
	return this.opened;
};

/**
 * Open node
 */
SpecialNode.prototype.open = function() {
	this.opened = true;
};

/**
 * @return {number} Cost of opening node
 */
SpecialNode.prototype.getCost = function() {
	return this.cost;
};

module.exports = SpecialNode;