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
	{id: 3, x: 300, y: 200, type: 1, neighbours: [2, 8]},
	{id: 4, x: 100, y: 100, type: 3, neighbours: [3]},
	{id: 5, x: 200, y: 100, type: 2, neighbours: [0]},
	{id: 6, x: 400, y: 100, type: 1, neighbours: [4]},
	{id: 7, x: 600, y: 100, type: 1, neighbours: [6]},
	{id: 8, x: 700, y: 400, type: 2, neighbours: [7]}
];

Board.CONFIG = [{"id":0,"x":41,"y":443,"type":3,"neighbours":[1]},{"id":1,"x":33,"y":360,"type":1,"neighbours":[0,2]},{"id":2,"x":47,"y":221,"type":1,"neighbours":[1,3]},{"id":3,"x":83,"y":269,"type":1,"neighbours":[2,4]},{"id":4,"x":124,"y":234,"type":1,"neighbours":[3,5]},{"id":5,"x":127,"y":303,"type":1,"neighbours":[4,6]},{"id":6,"x":130,"y":411,"type":1,"neighbours":[5,7]},{"id":7,"x":160,"y":417,"type":1,"neighbours":[6,8]},{"id":8,"x":189,"y":328,"type":1,"neighbours":[7,9,10]},{"id":9,"x":216,"y":252,"type":1,"neighbours":[8,10]},{"id":10,"x":249,"y":325,"type":1,"neighbours":[9,8,11]},{"id":11,"x":264,"y":407,"type":1,"neighbours":[10,12]},{"id":12,"x":338,"y":401,"type":1,"neighbours":[11,13,17]},{"id":13,"x":333,"y":324,"type":1,"neighbours":[12,14]},{"id":14,"x":328,"y":246,"type":1,"neighbours":[13,15,16]},{"id":15,"x":288,"y":245,"type":1,"neighbours":[14]},{"id":16,"x":371,"y":246,"type":1,"neighbours":[14]},{"id":17,"x":392,"y":397,"type":1,"neighbours":[12,18]},{"id":18,"x":413,"y":339,"type":1,"neighbours":[17,19,20]},{"id":19,"x":437,"y":270,"type":1,"neighbours":[18,20]},{"id":20,"x":475,"y":328,"type":1,"neighbours":[19,18,21]},{"id":21,"x":486,"y":396,"type":1,"neighbours":[20,22]},{"id":22,"x":517,"y":393,"type":1,"neighbours":[21,23,27]},{"id":23,"x":517,"y":329,"type":1,"neighbours":[22,24,26]},{"id":24,"x":517,"y":274,"type":1,"neighbours":[23,25]},{"id":25,"x":556,"y":285,"type":1,"neighbours":[24,26]},{"id":26,"x":579,"y":327,"type":1,"neighbours":[25,23,27]},{"id":27,"x":567,"y":373,"type":1,"neighbours":[26,22,28]},{"id":28,"x":608,"y":382,"type":1,"neighbours":[27,29]},{"id":29,"x":625,"y":324,"type":1,"neighbours":[28,30,31]},{"id":30,"x":642,"y":263,"type":1,"neighbours":[29,31]},{"id":31,"x":677,"y":312,"type":1,"neighbours":[30,32,29]},{"id":32,"x":683,"y":383,"type":1,"neighbours":[31]}];

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