var canvas = document.getElementById('map'),
	ctx = canvas.getContext('2d'),
	nodes = [],
    deleting = {
        mode: false,
        node: null,
        line: null
    }
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
			DELETE: 'red',
			LINE: 'blue'
		},
        NODE: [{"id":0,"x":40,"y":40,"type":3,"neighbours":[]}]
	};

function Node(x, y, type, id) {
	this.id = id || Node.id++;
	this.x = x;
	this.y = y;
	this.type = type || 1;
	this.neighbours = [];

	this.addNeighbour = function(node) {
		this.neighbours.push(node);
	};
}

Node.id = 0;

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

var touch = null;

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault(); // disable mouse stuff?

    if (touch) {
        // already has touch, support only single touch
        return;
    }

    if (e.touches.length === 0) {
        return;
    }

    touch = e.touches[0];

    click.down = true;
    click.update = true;

    var coords = getCoordsFromTouch(touch);
    mouse.update = true;
    mouse.x = coords.x;
    mouse.y = coords.y;
}, false);

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    var match = getMatchingTouch(e.touches);

    if (!match) {
        return;
    }

    touch = match;

    var coords = getCoordsFromTouch(match);

    mouse.update = true;
    mouse.x = coords.x;
    mouse.y = coords.y;

}, false);

canvas.addEventListener('touchend', touchEnd, false);
canvas.addEventListener('touchleave', touchEnd, false);
canvas.addEventListener('touchcancel', touchEnd, false);


function touchEnd(e) {
    var match = getMatchingTouch(e.changedTouches);

    if (match) {
        click.up = true;
        click.update = true;
        touch = null;
    }
}

function getMatchingTouch(touches) {
    if (!touch || !touches) {
        null;
    }

    for (var i = 0; i < touches.length; i++) {
        if (touches[i].identifier === touch.identifier) {
            return touches[i];
        }
    }
    return null;
}

function getCoordsFromTouch(touch) {
    return {
        x: touch.pageX - touch.target.offsetLeft,
        y: touch.pageY - touch.target.offsetTop
    };
}

function drawMap() {
	checkMove();
	checkClick();

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	nodes.forEach(drawNode);

	window.requestAnimationFrame(drawMap);
}

function drawNode(node) {
    var color;

	node.neighbours.forEach(function(neighbour) {
		drawPath(node, neighbour);
	});

	ctx.beginPath();
	ctx.arc(node.x, node.y, Config.RADIUS, 0, 2 * Math.PI, false);

    if (deleting.mode && deleting.node === node) {
        color = Config.Colors.DELETE;
    } else {
        color = node === current.active ? Config.Colors.SELECTED : Config.Colors.DEFAULT;
    }
	ctx.fillStyle = color;
	ctx.fill();
}

function drawPath(nodeA, nodeB) {
    var color = Config.Colors.LINE;

	ctx.globalCompositeOperation = 'destination-over';

	ctx.beginPath();

	ctx.moveTo(nodeA.x, nodeA.y);
	ctx.lineTo(nodeB.x, nodeB.y);

	ctx.lineWidth = 2;

    if (deleting.mode) {
        if (
            (deleting.node === nodeA || deleting.node === nodeB) ||
            deleting.line && (
            (deleting.line[0] === nodeA && deleting.line[1] === nodeB) ||
            (deleting.line[1] === nodeA && deleting.line[0] === nodeB))
        ) {
            color = Config.Colors.DELETE;
        }
    }

	ctx.strokeStyle = color;
	ctx.stroke();

	ctx.globalCompositeOperation = 'source-over';
}

function checkMove() {
	if (!mouse.update) {
		return;
	}

    if (deleting.mode) {
        var node = getNodeByCoords(mouse.x, mouse.y);

        if (node) {
            deleting.node = node;
            deleting.line = null;
        } else {
            var line = getLineByCoords(mouse.x, mouse.y);

            if (line) {
                deleting.line = line;
                deleting.node = null;
            } else {
                deleting.line = null;
                deleting.node = null;
            }
        }

        mouse.update = false;
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

    if (deleting.mode) {
        if (deleting.node) {
            deleteNode(deleting.node);
            deleting.node = null;
            deleting.line = null;
        } else if (deleting.line) {
            deleteLine(deleting.line);
            deleting.line = null;
        }

        click.down = click.up = false;
        click.update = false;

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
		if (getDistance(x, y, node.x, node.y) <= Config.RADIUS*2) {
			return node;
		}
	}

	return null;
}

function getLineByCoords(x, y) {
    var node,
        neighbour,
        i, j;

    for (i = 0; i < nodes.length; i++) {
        node = nodes[i];

        for (j = 0; j < node.neighbours.length; j++) {
            neighbour = node.neighbours[j];

            if (getDistanceToLine(x, y, node.x, node.y, neighbour.x, neighbour.y) < 5) {
                return [node, neighbour];
            }
        }
    }

    return null;
}

/**
 * Distance to line from point
 * @param {number} x0 X coord of point
 * @param {number} y0 Y coord of point
 * @param {number} x1 X coord of start point of line
 * @param {number} y1 Y coord of start point of line
 * @param {number} x2 X coord of end point of line
 * @param {number} y2 Y coord of end point of line
 * @returns {number} Distance
 */
function getDistanceToLine(x0, y0, x1, y1, x2, y2) {
    var Dx = x1 - x2,
        Dy = y1 - y2;

    return Math.abs(Dy*x0 - Dx*y0 + x1*y2 - x2*y1) /
        Math.sqrt(Math.pow(Dx, 2) + Math.pow(Dy, 2));
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

function loadConfig(conf) {
    var maxId = 0,
        nodesById = {};

    Node.id = 0;

    nodes = conf.map(function(nodeConf) {
        maxId = Math.max(maxId, nodeConf.id);

        nodesById[nodeConf.id] = new Node(nodeConf.x, nodeConf.y, nodeConf.type, nodeConf.id);

        return nodesById[nodeConf.id];
    });

    conf.forEach(function(nodeConf) {
        nodesById[nodeConf.id].neighbours = nodeConf.neighbours.map(function(nodeId) {
            return nodesById[nodeId];
        });
    });

    updateConfig();

    Node.id = maxId + 1;
}

function init() {
    var config = window.localStorage.map && JSON.parse(window.localStorage.map) || Config.NODE;

    loadConfig(config);
}

document.getElementById('save').addEventListener('click', function() {
    window.localStorage.map = document.getElementById('conf').value;
}, false);


document.getElementById('reset').addEventListener('click', function() {
    delete window.localStorage.map;

    current = {
        hover: null,
        selected: null,
        active: null
    };

    click = {
        update: false,
        down: false,
        up: false,
        downTimeout: null
    };

    mouse = {
        update: false,
        x: 0,
        y: 0
    };

    init();
}, false);

document.getElementById('delete').addEventListener('click', function(e) {
    deleting.mode = e.target.checked;

    if (deleting.mode) {
        current = {
            hover: null,
            selected: null,
            active: null
        };

        click = {
            update: false,
            down: false,
            up: false,
            downTimeout: null
        };

        mouse = {
            update: false,
            x: 0,
            y: 0
        };
    } else {
        deleting.line = null;
        deleting.node = null;
    }
    console.log(e.target.checked)
}, false);

function deleteNode(node) {
    // delete from neighbours
    node.neighbours.forEach(function(neighbour) {
        var index = neighbour.neighbours.indexOf(node);

        if (index !== -1) {
            neighbour.neighbours.splice(index, 1);
        }
    });

    // delete node
    var index = nodes.indexOf(node);

    if (index !== -1) {
        nodes.splice(index, 1);
    }
}

function deleteLine(line) {
    var index = line[0].neighbours.indexOf(line[1]);

    if (index !== -1) {
        line[0].neighbours.splice(index, 1);
    }

    index = line[1].neighbours.indexOf(line[0]);

    if (index !== -1) {
        line[1].neighbours.splice(index, 1);
    }
}

init();

updateConfig();

drawMap();

