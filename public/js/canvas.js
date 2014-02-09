/**
 * Created by martenhennoch on 09/02/14.
 */

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    w = canvas.width,
    h = canvas.height;

var map = [
  [2,1,1,1,2],
  [0,1,0,0,1],
  [2,1,1,0,1],
  [1,0,1,1,1],
  [1,1,3,0,1]
    ],
    dim = {
      x: map[0].length,
      y: map.length
    },
    shell = {
      x: w / dim.x,
      y: h / dim.y
    }


function drawMap(map) {
  ctx.beginPath();
  ctx.lineWidth = 5;

  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.lineTo(0, 0);

  ctx.stroke();
  ctx.closePath();


  for(var i = 0; i < map[0].length; i++){
    for(var j = 0; j < map[0].length; j++){
      switch (map[i][j]) {
        case 0:
          break;
        case 1:
          node(i, j);
          break;
        case 2:
          cat(i, j);
          break;
        case 3:
          start(i, j);
          break;
      }

    }
  }
}

function node(x, y){
  ctx.beginPath();
  var m = shell.x / 2; //distance to mid
  ctx.arc(y * shell.y + m, x * shell.x + m, 10, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}


function start(x, y){
  ctx.beginPath();
  var m = shell.x / 2; //distance to mid
  ctx.fillText("START", y * shell.y + m, x * shell.x + m);
  ctx.stroke();
  ctx.closePath();
}

function cat(x, y){
  ctx.beginPath();
  ctx.fillStyle = "red";
  var m = shell.x / 2; //distance to mid
  ctx.arc(y * shell.y + m, x * shell.x + m, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
}

(function init(){
  console.log("Init");
  drawMap(map);
})();





