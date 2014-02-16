function createMap(conf) {
	var row1 = '',
		row2 = '',
		row3 = '';

	conf.forEach(function(node) {
		row1 += '<td>' + node.type + '</td>';
		row2 += '<td class="player-node" id="node' + node.id + '"></td>';
		row3 += '<td id="button' + node.id + '"></td>';
	});

	document.getElementById('map').innerHTML = '<table><tr>' + row1 + '<tr></tr>' +
		row2 + '</tr><tr>' + row3 + '</tr></table>';
}

function createButton(label, action) {
	var button = document.createElement('button');

	button.innerHTML = label;
	button.onclick = function() {
		button.remove();
		action();
	};

	document.getElementById('buttons').appendChild(button);
}

function updatePlayers(players) {
	[].forEach.call(document.querySelectorAll('.player-node'), function(el) {
		el.innerHTML = '';
	});

	document.getElementById('players').innerHTML = 'Players: ' +
		players.map(function(player) {
			if (player.node !== null) {
				document.getElementById('node' + player.node).innerHTML += player.id + ' ';
			}

			return player.id;
		}).join(', ');
}

function updateActivePlayer(id) {
	document.getElementById('active').innerHTML = 'Active player: ' + id;
}

function updateRoll(roll) {
	var str = '';

	if (roll !== null) {
		str = 'Player rolled ' + roll;
	}

	document.getElementById('roll').innerHTML = str;
}

function clearMoves() {
	[].forEach.call(document.querySelectorAll('.moves'), function(el) {
		el.remove();
	});
}

function showMoves(ids, callback) {
	clearMoves();

	ids.forEach(function(id) {
		var button = document.createElement('button');

		button.innerHTML = 'Go';
		button.classList.add('moves');
		button.onclick = function() {
			callback(id);

			clearMoves();
		};

		document.getElementById('button' + id).appendChild(button);
	});
}