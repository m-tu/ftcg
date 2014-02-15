var Board = require('./Board');

/**
 * Single game of ftcg
 * @constructor
 */
var Game = function() {
	this.board = new Board();
	this.started = false;
	this.players = [];
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
 * @return {object} Player object on success, null on failure
 */
Game.prototype.addPlayer = function() {
	var player;

	if (this.started) {
		return null;
	}

	player = new Player(this.players.length);

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
		return player.id;
	});
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

Game.prototype.validateAction = function(player, action) {
	// check if correct player
	if (player !== this.currentPlayer) {
		return false;
	}
};

Game.prototype.rollDice = function() {
	this.roll = Math.floor(Math.random() * 6) + 1;

	return this.roll;
};

Game.prototype.moveTo = function(cellId) {
	var player = this.currentPlayer,
		cell = this.board.getCell(cellId);

	if (this.dice === null) {
		return false;
	}

	this.board.c
};

module.exports = Game;