
/* types
0 - nothing
1 - path
2 - cat gif
3 - start

 */
var mapConf = [
	[2,1,1,1,2],
	[0,1,0,0,1],
	[2,1,1,0,1],
	[1,0,1,1,1],
	[1,1,3,0,1]
];

/**
 * Represents single cell/square on the board
 * @param type {number}
 * @param x {number}
 * @param y {number}
 * @constructor
 */
function Cell(type, x, y) {
	var self = this;

	this.type = type;
	this.x = x;
	this.y = y;
	this.neighbours = [];

	/**
	 * Finds all of neighbours from map
	 *
	 * @param map {Map}
	 */
	this.findNeighbours = function(map) {
		self.neighbours = [];

		[[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function(diff) {
			var x = self.x + diff[0],
				y = self.y + diff[1],
				cell;

			if (x >= 0 && x < map.height && y >= 0 && y < map.width) {
				cell = map.grid[x][y];

				if (cell !== null) {
					self.neighbours.push(cell);
				}
			}
		});

	};

	/**
	 * Check if targetCell is reachable with dice moves
	 *
	 * @param targetCell {Cell}
	 * @param dice {number}
	 */
	this.isReachable = function(targetCell, dice) {
		if (dice === 1) {
			return self.neighbours.indexOf(targetCell) !== -1;
		} else {
			return self.neighbours.some(function(cell) {
				return cell.isReachable(targetCell, dice - 1);
			});
		}
	};
}

/**
 * Game map
 *
 * @constructor
 */
function Map() {
	var self = this;

	this.grid = [];
	this.height = 0;
	this.width = 0;
	this.start = null;

	/**
	 * Initialize map with config
	 *
	 * @param grid {Array} Initial config
	 */
	this.init = function(grid) {

		self.height = grid.length;
		self.width = grid[0].length;

		// create cells
		grid.forEach(function(row, rowNum) {
			var gridRow = [];

			row.forEach(function(cellType, cellNum) {
				var cell;

				if (cellType === 0) {
					gridRow.push(null);
				} else {
					cell = new Cell(cellType, rowNum, cellNum);
					gridRow.push(cell);

					if (cellType === 3) {
						self.start = cell;
					}
				}

			});

			self.grid.push(gridRow);
		});

		// add neighbours
		self.grid.forEach(function(row) {
			row.forEach(function(cell) {
				if (cell !== null) {
					cell.findNeighbours(self);
				}
			})
		})


	}
}

/**
 * Player
 *
 * @param map {Map}
 * @constructor
 */
function Player(map) {
	var self = this;

	this.map = map;
	this.cell = map.start;

	/**
	 * Move player to cell if possible
	 *
	 * @param cell {Cell} New cell
	 * @param dice {number} Number on dice
	 */
	this.goTo = function(cell, dice) {
		if (self.cell.isReachable(cell, dice)) {
			self.cell = cell;
		}

	}
}

var map = new Map();
map.init(mapConf);



var player1 = new Player(map);

var player2 = new Player(map);

