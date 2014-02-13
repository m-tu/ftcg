/**
 * Single game of ftcg
 * @constructor
 */
var Game = function() {
	this.board = new Board();
	this.players = [];
};

/**
 * Add new player to the game
 *
 * @param player {Player}
 */
Game.prototype.addPlayer = function(player) {
	this.players.push(player);

	this.board.start.addPlayer(player);
};

/**
 * Get some debug info about the game
 *
 * @returns {string} Info
 */
Game.prototype.getInfo = function() {
	return 'Players: ' + this.players.length;
};