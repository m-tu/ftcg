var Node = require('./Node');

var Board = function() {
	this.nodes = {};
	this.start = null;
	this.config = Board.CONFIG;
	this.config = this.generateConfig(20);
	this.loadConfig(Board.CONFIG);
};

/**
 * Generate random board config
 * @param w {number} canvas width
 * @param h {number} canvas height
 * @param blanks {number} amount of blank nodes
 * @param gifs {number} amount of gif nodes
 * @returns Board.CONFIG
 */
Board.generateRandomConfig = function(w, h, blanks, gifs) {
	var config = [],
			total = blanks + gifs + 1;//start

	return config;
}




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
 * Generate straight line config
 *
 * @param size
 */
Board.prototype.generateConfig = function(size) {
	var conf = [],
		i;

	for (i = 0; i < size; i++) {
		conf.push({
			id: i,
			x: 0,
			y: 0,
			type: i % 3 === 0 ? 2 : 1,
			neighbours: [i - 1, i + 1]
		});
	}

	conf[0].neighbours = [1];
	conf[size - 1].neighbours = [size - 2];

	conf[size >> 1].type = 3;

	return conf;
};

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

/**
 * /**
 * Check if toNode is reachable from fromNode in moves
 *
 * @param {Node} fromNode
 * @param {Node} toNode
 * @param {number} moves
 * @return {boolean}
 */
Board.prototype.isReachable = function(fromNode, toNode, moves) {
	var self = this;

	if (moves === 1) {
		return fromNode.neighbours.indexOf(toNode) !== -1;
	}

	return fromNode.neighbours.some(function(node) {
		self.isReachable(node, toNode, moves - 1);
	});
};

module.exports = Board;