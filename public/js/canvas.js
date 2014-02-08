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


function drawBorders() {
  ctx.beginPath();
  ctx.lineWidth = 5;

  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.lineTo(0, 0);


    for(var j = 0; j < dim.y; j++) {
      ctx.moveTo(0, j * shell.y);
      ctx.lineTo(w, j * shell.y);
    }
    for(var i = 0; i < dim.x; i++) {
      ctx.moveTo(i * shell.y, 0);
      ctx.lineTo(i * shell.y, h);
    }

  ctx.stroke();
  ctx.closePath();
}

function parseMap(m){
  for(var i = 0; i < m[0].length; i++) {
    for(var j = 0; j < m[i].length; j++) {

    }
  }
}

(function init(){
  console.log("Init");
  drawBorders();
})();





