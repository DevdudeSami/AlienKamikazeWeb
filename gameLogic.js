var gameScreen;
var peter;
var block;
var info;

var blockOnScreen = false;
var state = "playing";  // playing || gameOver
var score = 0;
var moving = "none"; // none || left || right

var petePos = { x: 0, y: 0 };
var blockPos = { x: 0, y: 0 };

const blockNames = ["Algs.png", "AP.png", "DF.png", "IS.png", "PSD.png"];
const gameWidth = 800;
const gameHeight = 600;

const speed = 6;
var blockSpeed = 3;

/// Set initial variables and conditions
function initialiseGame() {
  // variables
  peter = $("#peter");
  gameScreen = $("#game");
  block = $("#block");
  info = $("#info");

  // initialise game screen dimensions
  gameScreen.css({ 'width': gameWidth + 'px', 'height': gameHeight + 'px' });

  console.log(getPosition(gameScreen));

  // set initial position for peter
  setPosition(peter, 0.5*(gameWidth-peter.width()), gameHeight-peter.height());

  // set position for info box
  hideInfo();

  // listen to keydown events
  window.addEventListener('keydown', keyPressed);
  window.addEventListener('keyup', keyReleased);

  // Start game loop
  window.setInterval(gameLoop, 5);
}

function gameLoop() {

  if(state == "playing") {
    if(!blockOnScreen) {
      createNewBlock();
      blockOnScreen = true;
    } else {
      // move the block
      setPosition(block, getPosition(block).x, getPosition(block).y+blockSpeed);

      // move peter
      if(moving == "left") { moveLeft(); }
      else if(moving == "right") { moveRight(); }

      // check collision
      if(detectCollision(peter, block)) {
        score += 1;
        updateScoreView();
        blockOnScreen = false;

        if(score % 2 == 0) {
          blockSpeed += 0.1;
        }
      }

      // check block reached end
      if(getPosition(block).y+0.5*block.height() > gameHeight) {
        endGame();
      }
    }
  }
}

function endGame() {
  state = "gameOver";
  showInfo()
  updateScoreView();
  createNewBlock();
}

function restartGame() {
  hideInfo();
  score = 0;
  blockSpeed = 3;
  state = "playing";
}

function updateScoreView() {
  $(".score").html(score);
}

function showInfo() {
  setPosition(info, 0.5*(gameWidth-info.width()), 0.5*(gameHeight-info.height()));
}

function hideInfo() {
  setPosition(info, -1000, -1000);
}

function createNewBlock() {
  var blockName = blockNames[getRandomInt(0,5)];

  block.prop('src', "assets/"+blockName);
  setPosition(block, getRandomInt(0,gameWidth-block.width()), -1.5*block.height());
}

function keyPressed(event) {
  if(state == "playing") {
    if(event.key === "ArrowLeft") {
     moving = "left";
    }
    else if(event.key === "ArrowRight") {
      moving = "right";
    }
  }

  if(event.keyCode == 13) {
    if(state == "gameOver") { restartGame(); }
  }
}

function keyReleased(event) {
  moving = "none";
}

function moveLeft() {
  setPosition(peter, getPosition(peter).x-speed, getPosition(peter).y);
  if(getPosition(peter).x < 0) {
    setPosition(peter, 0, getPosition(peter).y);
  }
}

function moveRight() {
  setPosition(peter, getPosition(peter).x+speed, getPosition(peter).y);
  if(getPosition(peter).x > gameWidth-peter.width()) {
    setPosition(peter, gameWidth-peter.width(), getPosition(peter).y);
  }
}

function detectCollision(a, b) { // a is Peter, b is block
    var aPos = getPosition(a);
    var bPos = getPosition(b);

    var x1 = aPos.x;
    var y1 = aPos.y;
    var w1 = a.width();
    var h1 = a.height();

    var x2 = bPos.x;
    var y2 = bPos.y;
    var w2 = b.width();
    var h2 = b.height();

    return (
      (y1 < y2 + h2) && // y condition
      (
        (x1 > x2 && x1 < x2 + w2) || // first x condition
        (x1 + w1 > x2 && x1 + w1 < x2 + w2) // second x condition
      )
    );
}

// HELPER FUNCTIONS
function setPosition(jObj, x, y) {
  jObj.css({ 'left': x + 'px', 'top': y + 'px' });
}

function getPosition(jObj) {
  var left = jObj.position().left;
  var top = jObj.position().top;

  return { x: left, y: top };
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// CALL INITIALISER AT START
$(function() {
  initialiseGame()
})
