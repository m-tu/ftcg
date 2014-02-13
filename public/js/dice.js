/**
 * Created by martenhennoch on 10/02/14.
 */


var diceCanvas = document.getElementById("diceCanvas"),
    diceCtx = diceCanvas.getContext("2d"),
    diceW = diceCanvas.width,
    diceH = diceCanvas.height;

function diceBorders() {
  diceCtx.beginPath();
  diceCtx.lineWidth = 2;

  diceCtx.moveTo(0, 0);
  diceCtx.lineTo(diceW, 0);
  diceCtx.lineTo(diceW, diceH);
  diceCtx.lineTo(0, diceH);
  diceCtx.lineTo(0, 0);

  diceCtx.stroke();
  diceCtx.closePath();
}


function rollDice(min, max) {

  var roll = Math.floor(Math.random() * (max - min + 1) + min);
  var speed = 50,
      count = 30,
      run = 0,
      tmpRoll = 1;

  var interval = setInterval(function(){
    if(run === count) {
      clearInterval(interval);

    }
    if(run === count -1) tmpRoll = roll;
    run++;
    diceCtx.clearRect(0, 0, diceCanvas.width, diceCanvas.height);
    diceCtx.font = 'bold 90pt Calibri';
    diceCtx.fillText(tmpRoll, diceW/2 -25, diceH/2+50);
    diceCtx.stroke();
    tmpRoll = Math.floor(Math.random() * (max - min + 1) + min);
  }, speed)

}

(function intiDice(){
  diceBorders();
})();