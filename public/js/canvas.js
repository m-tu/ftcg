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
  mainCtx.beginPath();
  mainCtx.arc(x, y, 10, 0, 2 * Math.PI);
  mainCtx.stroke();
  mainCtx.closePath();
}

function drawStart(x, y){
  mainCtx.beginPath();
//  mainCtx.fillText("START", x, y);
	mainCtx.fillStyle = "red";
	mainCtx.arc(x, y, 10, 0, 2 * Math.PI);
//  mainCtx.stroke();
	mainCtx.fill();
  mainCtx.closePath();
}

function drawCat(x, y){
	var img = new Image();
	img.src = "/images/cat_40x38.png";
  mainCtx.beginPath();
//	mainCtx.arc(x, y, 21, 0, 2 * Math.PI);
	img.onload = function(){
		mainCtx.drawImage(img, x, y);
	};
//	mainCtx.stroke();
  mainCtx.closePath();
}

function drawPlayer(node, player) {
	console.log("ndoe");
	console.log(node);
	console.log("player");
	console.log(player);
}


function drawMap(board) {
	drawBorders();
	//draw nodes
	for(var node in board.nodes) {
		var currentNode = nodes[node];
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
		if(node.players.length > 0) {
			node.players.forEach(function(player){
				drawPlayer(node, player);
			});
		}
	}
	//draw players


}





