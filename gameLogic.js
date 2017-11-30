var gameScreen;
var player;
var info;

var state = "playing";  // playing || gameOver
var score = 0;
var moving = "none"; // none || left || right

var enemies = []; // array of enemy objects {enemyObj: enemyObj, speed: speed} ships on screen

var enemyTimer = 0;
const enemyTimerMax = 25;

const minEnemySpeed = 1;
const maxEnemySpeed = 5;

const enemyNames = ["Alien Ship.png", "Blue Alien.png", "Purple Ship.png", "Red Alien.png", "Thick Alien Ship.png", "Thin Alien Ship.png"];
const gameWidth = 600;
const gameHeight = 700;

const speed = 6;

/// Set initial variables and conditions
function initialiseGame() {
  // variables
  player = $("#player");
  gameScreen = $("#game");
  info = $("#info");

  // initialise game screen dimensions
  gameScreen.css({ 'width': gameWidth + 'px', 'height': gameHeight + 'px' });

  // set initial position for player
  setPosition(player, 0.5*(gameWidth-player.width()), gameHeight-player.height());

  // set position for info box
  hideInfo();

  // listen to keydown events
  window.addEventListener('keydown', keyPressed);
  window.addEventListener('keyup', keyReleased);

  // Start game loop
  window.setInterval(gameLoop, 15);
}

function gameLoop() {
  if(state == "playing") {
    // check if should create enemy
    if(enemyTimer > enemyTimerMax) {
      enemyTimer = 0;
      createNewEnemy();
    } else {
      enemyTimer += 1;
    }

    // move enemies and check collisions
    enemies.forEach(function(enemy){
      var enemySprite = enemy.enemyObj;

      setPosition(enemySprite, getPosition(enemySprite).x, getPosition(enemySprite).y+enemy.speed);

      // check collision
      if(detectCollision(player, enemySprite)) {
        endGame();
      }

      // check enemy reached end
      if(getPosition(enemySprite).y+0.5*enemySprite.height() > gameHeight) {
        score += 1;
        enemySprite.remove();
        updateScoreView();
      }
    });

    // move player
    if(moving == "left") { moveLeft(); }
    else if(moving == "right") { moveRight(); }
  }
}

function endGame() {
  state = "gameOver";
  showInfo()
  updateScoreView();
}

function restartGame() {
  hideInfo();
  score = 0;
  updateScoreView();
  state = "playing";

  $(".enemy").remove();
  enemies.removeAll();
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

function createNewEnemy() {
  var enemyName = enemyNames[getRandomInt(0,enemyNames.length)];

  var enemy = $("<img class='enemy'>");
  enemy.prop('src', "assets/"+enemyName);

  var speed = getRandomInt(minEnemySpeed, maxEnemySpeed+1);

  gameScreen.append(enemy);
  enemies.push({enemyObj: enemy, speed: speed});

  setPosition(enemy, getRandomInt(0,gameWidth-enemy.width()), -1.5*enemy.height());
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
  setPosition(player, getPosition(player).x-speed, getPosition(player).y);
  if(getPosition(player).x < 0) {
    setPosition(player, 0, getPosition(player).y);
  }
}

function moveRight() {
  setPosition(player, getPosition(player).x+speed, getPosition(player).y);
  if(getPosition(player).x > gameWidth-player.width()) {
    setPosition(player, gameWidth-player.width(), getPosition(player).y);
  }
}

function detectCollision(a, b) { // a is player, b is enemy
    var aPos = getPosition(a);
    var bPos = getPosition(b);

    var x1 = aPos.x+0.25*a.width();
    var y1 = aPos.y+0.25*a.height();
    var w1 = 0.5*a.width();
    var h1 = 0.5*a.height();

    var x2 = bPos.x+0.25*b.width();
    var y2 = bPos.y+0.25*b.height();
    var w2 = 0.5*b.width();
    var h2 = 0.5*b.height();

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
