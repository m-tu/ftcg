var Board = require('./Board');

/**
 * Single game of ftcg
 * @constructor
 */
var Game = function() {
	this.board = new Board();
	this.started = false;
	this.players = [];
	/**
	 *
	 * @type {Player|null}
	 */
	this.currentPlayer = null;
	this.dice = null;
};

/**
 * List of actions players can make
 * @type {object}
 */
Game.Actions = {
	ROLL_DICE: 'roll_dice',
	MOVE_TO: 'move_to'
};

/**
 * Add new player to the game, if game hasn't started yet
 *
 * @param {object} [data] Custom data related to user
 * @return {Player|null} Player object on success, null on failure
 */
Game.prototype.addPlayer = function(data) {
	var player;

	if (this.started) {
		return null;
	}

	player = new Player(this.players.length, data);

	this.players.push(player);

	return player;
};

/**
 * Info about players
 *
 * @return {Array} Array of player IDs
 */
Game.prototype.getPlayersInfo = function() {
	return this.players.map(function(player) {
		return {
			id: player.id,
			node: player.getNodeId()
		};
	});
};

/**
 * @return {number|null}
 */
Game.prototype.getActivePlayerId = function() {
	if (this.currentPlayer === null) {
		return null;
	}

	return this.currentPlayer.id;
};

/**
 * Start the game
 *
 * @return {boolean} True on success, false on failure
 */
Game.prototype.start = function() {
	var self = this;

	if (this.players.length > 0 && !this.started) {
		this.started = true;

		this.players.forEach(function(player) {
			self.board.start.addPlayer(player);
		});

		this.currentPlayer = this.players[0];

		return true;
	} else {
		return false;
	}
};

/**
 * Check if it is player's move
 *
 * @param {Player} player
 * @return {boolean}
 */
Game.prototype.isValidPlayer = function(player) {
	// check if correct player
	return player === this.currentPlayer;
};

/**
 * Roll dice
 *
 * @return {number|null} Result of roll or null on failure
 */
Game.prototype.rollDice = function() {
	if (this.dice !== null) {
		// already rolled
		return null;
	}

	this.dice = Math.floor(Math.random() * 6) + 1;

	return this.dice;
};

/**
 * Get all nodes which currentPlayer can reach with roll moves
 *
 * @return {Array}
 */
Game.prototype.getReachableNodes = function() {
	var currentNode = this.currentPlayer.node,
		reachableNodes = [];

	this.populateReachableNodes(currentNode, this.dice, reachableNodes);

	return reachableNodes.map(function(node) {
		return node.id;
	});
};

/**
 * Populates the reachableNodes array with nodes which are reachable form fromNode in moves
 *
 * @param {Node} fromNode
 * @param {number} moves
 * @param {Array} reachableNodes
 */
Game.prototype.populateReachableNodes = function(fromNode, moves, reachableNodes) {
	var self = this;

	if (moves === 1) {
		fromNode.neighbours.forEach(function(node) {
			if (reachableNodes.indexOf(node) === -1) {
				reachableNodes.push(node);
			}
		})
	} else {
		fromNode.neighbours.forEach(function(node) {
			self.populateReachableNodes(node, moves - 1, reachableNodes);
		});
	}
};

/**
 * Move current player to new node
 *
 * @param {number} nodeId Target node id
 * @return {boolean} True on success, false on failure
 */
Game.prototype.moveTo = function(nodeId) {
	var player = this.currentPlayer,
		currentNode = player.getNode(),
		targetNode = this.board.getNode(nodeId);

	if (this.dice === null) {
		console.log('not valid dice');
		return false;
	}

	if (!this.board.isReachable(currentNode, targetNode, this.dice)) {
		console.log('node not reachable');
		return false;
	}

	targetNode.addPlayer(player);

	// TODO check for node special actions etc.

	this.endTurn();

	return true;
};

/**
 * End turn of current player
 */
Game.prototype.endTurn = function() {
	var playerIndex = this.players.indexOf(this.currentPlayer) + 1,
		nextPlayer = playerIndex === this.players.length
			? this.players[0] : this.players[playerIndex];

	this.dice = null;
	this.currentPlayer = nextPlayer;

};

module.exports = Game;