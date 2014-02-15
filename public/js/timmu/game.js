function createMap(conf) {
	var row1 = '',
		row2 = '';

	conf.forEach(function(node) {
		row1 += '<td>' + node.type + '</td>';
		row2 += '<td id="node' + node.id + '"></td>';
	});

	document.getElementById('map').innerHTML = '<table><tr>' + row1 + '<tr></tr>' +
		row2 + '</tr></table>';
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
	document.getElementById('players').innerHTML = 'Players: ' +
		players.join(', ');
}