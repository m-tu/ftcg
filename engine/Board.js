var Node = require('./Node');

var Board = function() {
	this.nodes = {};
	this.start = null;
	this.config = Board.CONFIG;
	this.loadConfig(Board.CONFIG);
};

/**
 * Default config
 * @type {Array} Array of node objects
 */
Board.CONFIG = [
	{id: 1, x: 0, y: 0, type: 1, neighbours: [2]},
	{id: 2, x: 0, y: 0, type: 1, neighbours: [1, 3]},
	{id: 3, x: 0, y: 0, type: 1, neighbours: [2, 4]},
	{id: 4, x: 0, y: 0, type: 3, neighbours: [3]}
];

/**
 * Load config
 *
 * @param conf {Array} Board config
 */
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

module.exports = Board;