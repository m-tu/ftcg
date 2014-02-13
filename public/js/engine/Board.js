var Board = function() {
	this.nodes = {};
	this.start = null;
	this.loadConfig(Board.CONFIG);
};

/**
 * Default config
 * @type {Array} Array of node objects
 */
Board.CONFIG = [
	{id: 1, x: 300, y: 600, type: 1, neighbours: [2]},
	{id: 2, x: 100, y: 400, type: 1, neighbours: [1, 3]},
	{id: 3, x: 300, y: 200, type: 1, neighbours: [2, 4]},
	{id: 4, x: 20, y: 20, type: 3, neighbours: [3]},
	{id: 5, x: 500, y: 400, type: 2, neighbours: [4]}
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