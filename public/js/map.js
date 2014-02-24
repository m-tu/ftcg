var canvas = document.getElementById('map'),
	ctx = canvas.getContext('2d'),
	nodes = [],
	current = {
		hover: null,
		selected: null,
		active: null
	},
	click = {
		update: false,
		down: false,
		up: false,
		downTimeout: null
	},
	mouse = {
		update: false,
		x: 0,
		y: 0
	},
	Config = {
		RADIUS: 10,
		Colors: {
			DEFAULT: 'green',
			SELECTED: 'orange',
			ACTIVE: 'red',
			LINE: 'blue'
		}
	};

function Node(x, y, type) {
	this.id = Node.id++;
	this.x = x;
	this.y = y;
	this.type = type || 1;
	this.neighbours = [];

	this.addNeighbour = function(node) {
		this.neighbours.push(node);
	};
}

Node.id = 0;

nodes.push(new Node(40, 40, 3));

canvas.onmousedown = function(e) {
	e.preventDefault();
	click.down = true;
	click.update = true;
};

canvas.onmouseup = function(e) {
	e.preventDefault();
	click.up = true;
	click.update = true;
};

canvas.onmousemove = function(e) {
	e.preventDefault();
	mouse.update = true;
	mouse.x = e.offsetX;
	mouse.y = e.offsetY;
};

function drawMap() {
	checkMove();
	checkClick();

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	nodes.forEach(drawNode);

	window.requestAnimationFrame(drawMap);
}

function drawNode(node) {
	node.neighbours.forEach(function(neighbour) {
		drawPath(node, neighbour);
	});

	ctx.beginPath();
	ctx.arc(node.x, node.y, Config.RADIUS, 0, 2 * Math.PI, false);
	ctx.fillStyle = node === current.active ? Config.Colors.SELECTED : Config.Colors.DEFAULT;
	ctx.fill();
}

function drawPath(nodeA, nodeB) {
	ctx.globalCompositeOperation = 'destination-over';

	ctx.beginPath();

	ctx.moveTo(nodeA.x, nodeA.y);
	ctx.lineTo(nodeB.x, nodeB.y);

	ctx.lineWidth = 2;
	ctx.strokeStyle = Config.Colors.LINE;
	ctx.stroke();

	ctx.globalCompositeOperation = 'source-over';
}

function checkMove() {
	if (!mouse.update) {
		return;
	}

	current.hover = getNodeByCoords(mouse.x, mouse.y);

	if (current.moving) {
		if (current.hover && current.hover !== current.moving) {
			canvas.style.cursor = 'no-drop';
		} else {
			current.moving.x = mouse.x;
			current.moving.y = mouse.y;
			updateConfig();
		}
	} else if (current.selected) {
		if (getDistance(current.selected.x, current.selected.y, mouse.x, mouse.y) > Config.RADIUS) {
			// mouse moved after node selection
			current.moving = current.selected;

			current.moving.x = mouse.x;
			current.moving.y = mouse.y;

			canvas.style.cursor = 'move';
			current.selected = null;
			updateConfig();
		}
	} else if (current.hover) {
		canvas.style.cursor = 'crosshair';
	} else {
		canvas.style.cursor = '';
	}

	mouse.update = false;
}

function checkClick() {
	var node;

	if (!click.update) {
		return;
	}

	if (click.up) {
		if (current.moving) {
			current.moving = null;
		} else if (current.selected) {
			if (current.active) {
				if (current.active === current.selected) {
					current.active = null;
				} else {
					if (current.active.neighbours.indexOf(current.selected) === -1) {
						current.active.addNeighbour(current.selected);
						current.hover.addNeighbour(current.active);
						updateConfig();
					}

					current.active = current.selected;
				}
			} else {
				current.active = current.selected;
			}

			current.selected = null;

		} else if (current.active) {
			node = new Node(mouse.x, mouse.y);

			nodes.push(node);

			node.addNeighbour(current.active);
			current.active.addNeighbour(node);

			current.active = node;

			canvas.style.cursor = 'crosshair';
			updateConfig();
		}

	} else if (click.down) {
		if (current.hover) {
			current.selected = current.hover;
		}
//		canvas.style.cursor = 'crosshair';
	}


	click.down = click.up = false;
	click.update = false;
}

function getNodeByCoords(x, y) {
	var i,
		node;

	for (i = 0; i < nodes.length; i++) {
		node = nodes[i];
		if (getDistance(x, y, node.x, node.y) <= Config.RADIUS) {
			return node;
		}
	}

	return null;
}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function generateConfig() {
	return nodes.map(function(node) {
		return {
			id: node.id,
			x: node.x,
			y: node.y,
			type: node.type,
			neighbours: node.neighbours.map(function(neighbour) {
				return neighbour.id;
			})
		};
	});
}

function updateConfig() {
	document.getElementById('conf').value = JSON.stringify(generateConfig());
}

updateConfig();

drawMap();