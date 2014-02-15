/**
 * Created by martenhennoch on 09/02/14.
 */

var canvas = document.getElementById("canvas"),
    mainCtx = canvas.getContext("2d"),
    w = canvas.width,
    h = canvas.height;

function drawBorders() {
	mainCtx.beginPath();
	mainCtx.lineWidth = 5;

	mainCtx.moveTo(0, 0);
	mainCtx.lineTo(w, 0);
	mainCtx.lineTo(w, h);
	mainCtx.lineTo(0, h);
	mainCtx.lineTo(0, 0);

	mainCtx.stroke();
	mainCtx.closePath();
}

function drawNode(x, y){
	mainCtx.fillStyle = "black";
  mainCtx.beginPath();
  mainCtx.arc(x, y, 10, 0, 2 * Math.PI);
  mainCtx.fill();
  mainCtx.closePath();
}

function drawStart(x, y){
  mainCtx.beginPath();
	mainCtx.fillStyle = "gray";
	mainCtx.arc(x, y, 10, 0, 2 * Math.PI);
	mainCtx.fill();
  mainCtx.closePath();
}

function drawCat(x, y){
	var img = new Image();
	img.src = "/images/cat_40x38.png";
  mainCtx.beginPath();
	img.onload = function(){
		mainCtx.drawImage(img, x, y);
	};
  mainCtx.closePath();
}

function drawPlayer(node) {
	var x = node.x,
			y = node.y,
			playersOnNode = node.players.length,
			sectorDegree = 2 * Math.PI / playersOnNode,
			startAngle = 0;

	node.players.forEach(function(player){
		mainCtx.beginPath();
		mainCtx.lineWidth = 10;
		mainCtx.strokeStyle = player.color;
		mainCtx.arc(x, y, 15, startAngle, startAngle + sectorDegree);
		mainCtx.stroke();
		mainCtx.closePath();
		startAngle += sectorDegree;
	})
}

function drawLinesToNeighbours(board) {
	mainCtx.lineWidth = 2;
	for(var nodeId in board.nodes) {
		var node = board.nodes[nodeId];
		for(var neighbourId in node.neighbours) {
			var neighbour = node.neighbours[neighbourId];
			mainCtx.beginPath();
			mainCtx.moveTo(node.x, node.y);
			mainCtx.lineTo(neighbour.x, neighbour.y);
			mainCtx.stroke();
			mainCtx.closePath();
		}
	}
}

function drawMap(board) {
	mainCtx.clearRect(5,5, w, h);
	drawBorders();
	for(var node in board.nodes) {
		var currentNode = board.nodes[node];
		var x = currentNode.x,
				y = currentNode.y;
		switch (currentNode.type) {
			case 1:
				drawNode(x, y);
				break;
			case 2:
				drawCat(x, y);
				break;
			case 3:
				drawStart(x, y);
				break;
		}
		if(currentNode.players.length > 0) {
			currentNode.players.forEach(function(player){
				drawPlayer(currentNode);
			});
		}
		mainCtx.strokeStyle = "black";
	}
	drawLinesToNeighbours(board);
}





