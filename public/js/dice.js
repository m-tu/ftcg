/**
 * Created by martenhennoch on 10/02/14.
 */


var canvas = document.getElementById("diceCanvas"),
    ctx = canvas.getContext("2d"),
    w = canvas.width,
    h = canvas.height;

function diceBorders() {
  ctx.beginPath();
  ctx.lineWidth = 2;

  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.lineTo(0, 0);

  ctx.stroke();
  ctx.closePath();
}


function rollDice(min, max) {

  var roll = Math.floor(Math.random() * (max - min + 1) + min);
  console.log("Roll: " + roll);
  var speed = 50,
      count = 30,
      run = 0,
      tmpRoll = 1;

  var interval = setInterval(function(){
    if(run === count) {
      clearInterval(interval);
      console.log("tmRoll:" + tmpRoll);
    }
    if(run === count -1) tmpRoll = roll;
    run++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 90pt Calibri';
    ctx.fillText(tmpRoll, w/2 -25, h/2+50);
    ctx.stroke();
    tmpRoll = Math.floor(Math.random() * (max - min + 1) + min);
  }, speed)


}

(function intiDice(){
  diceBorders();
})();