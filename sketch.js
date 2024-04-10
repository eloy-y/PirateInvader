
let canvas;
let player;
let black;
let red;
let white;
let bgColor;
let shots = []; 
let ships = []; 
let lasers = [];
let score = 0;
let highScore = 0;
// all alien ship images
let alien1_a;
let alien1_b;
let alien2_a;
let alien2_b;
let alien3_a;
let alien3_b;
let textfont;
let speed = 5; // aliens move once ever x frames, lower is faster.
laserSpeed = 10; // speed at which alien laser shots move
let alienDirection = 'left';
let chanceOfFiringLaser = 50; 
let pauseMode = false;
let pauseTime = 0;
let gameOverBool = false;

///////////  Marcus     ///////////<<<<

const Y_AXIS = 1;

//////////////////////>>>>

function preload() {
  alien1_a = loadImage('ship.png');
  alien1_b = loadImage('ship.png');
  alien2_a = loadImage('ship.png');
  alien2_b = loadImage('ship.png');
  alien3_a = loadImage('ship.png');
  alien3_b = loadImage('ship.png');
  textfont = loadFont('game.ttf')
}

function setup() {
  canvas = createCanvas(400, 400);
  canvas.parent('project');
  canvas.id('spaceInvaders');
  noSmooth(); 
  textFont(textfont);
  red = color(255, 51, 0);
  black = color(0)
  white = color(255);
  bgColor = color(50);
  frameRate(10); // 
  player = new MyShip();
  createAllAliens();
  imageMode(CENTER);
}

function draw() {
  if (focused || frameCount < 30) {
    
    ///////////   Marcus   ///////////////////<<<<
    
    setGradient(0, 0, width, height, color(0, 102, 204), color(  230, 204, 128), Y_AXIS);
    
    ///////////////////////////////>>>>

    player.move();
    player.drawPlayer();
    player.drawExtraLives();
    drawScore();
    if (!pauseMode) { 
      
      moveAllShots();
      moveAllLasers();
      
      if (frameCount % speed == 0) {
        moveAllAliens();
        fireLaser();
      }
    }
    if (pauseMode) {
      animateNewLife();
    }
    drawAllShots();
    drawAllLasers();
    drawAllAliens();
    hitAlien();
    hitPlayer();
    if (allAliensKilled()) {
      print('all aliens killed!');
      if (player.lives < 3){
        lifeGain();
      }
      resetAliens();
    }
  } else {
    drawUnpauseInstructions();
  }
}

////////////////   Marcus   /////////////////////////////////<<<<

function drawUnpauseInstructions() {
  background(0)
  noStroke();
  fill(255);
  textAlign(CENTER);
  textSize(15);
  text('PIRATE INVADERS\n\nA & D to Move\nor\nLeft & Right Arrow to Move\n\nSpacebar to Shoot\n\nDont get hit\nYouve 3 lives\n\nClick to start playing', width / 2, height - height/1.3);
}

//////////////////////////////////////////////////>>>>

function keyPressed() {
  if (key === ' ') {
    if (!pauseMode) {
      print('shot fired!');
      player.fire();
    }
  }
  if ((keyCode === LEFT_ARROW) || (keyCode === 65)){
    print('directon changes!');
    player.changeDirection('left');
  }
  if ((keyCode === RIGHT_ARROW) || (keyCode === 68)) {
    player.changeDirection('right');
  }
  if ((keyCode === RETURN || keyCode === ENTER) && gameOverBool) {
    reset();
  }
  return false; 
}

function mousePressed() {}

function keyReleased() {
  if (keyIsPressed === false) {
    player.changeDirection('none');
  }
}

function drawAllShots() {
  for (let shot of shots) {
    shot.draw();
  }
}

function moveAllShots() {
  for (let shot of shots) {
    shot.move();
  }
}

function createAllAliens() {
  let startingX = 70;
  let startingY = 200;
  
  for (i = 0; i < 22; i++) {
    ships[i] = new Alien(startingX, startingY, 20, 20, alien1_a, alien1_b, 10);
    startingX += 30;
    if (startingX > width - 30) {
      startingX = 70;
      startingY -= 30;
    }
  }
  
  for (i = 22; i < 44; i++) {
    ships[i] = new Alien(startingX, startingY, 18, 14, alien2_a, alien2_b, 20);
    startingX += 30;
    if (startingX > width - 30) {
      startingX = 70;
      startingY -= 30;
    }
  }
  
  for (i = 44; i < 55; i++) {
    ships[i] = new Alien(startingX, startingY, 14, 14, alien3_a, alien3_b, 40);
    startingX += 30;
    if (startingX > width - 30) {
      startingX = 70;
      startingY -= 30;
    }
  }
}

function drawAllAliens() {
  for (let ship of ships) {
    ship.draw();
  }
}


function moveAllAliens() {
  for (let ship of ships) {
    ship.moveHorizontal(alienDirection);
  }
  if (checkIfAliensReachedEdge()) {
    reverseAlienDirections();
    moveAllAliensDown();
  }
}

function checkIfAliensReachedEdge() {
  let edgeReached = false;
  for (let ship of ships) {
    if ((ship.x < 15 && ship.alive) || (ship.x > width - 15 && ship.alive)) {
      edgeReached = true;
    }
  }
  return edgeReached;
}


function reverseAlienDirections() {
  if (alienDirection === 'left') {
    alienDirection = 'right';
  } else {
    alienDirection = 'left';
  }
}

function moveAllAliensDown() {
  for (let ship of ships) {
    ship.moveVertical();
  }
}

function hitAlien() {
  for (let shot of shots) {
    for (let ship of ships) {
      
      if (shot.x > ship.x - ship.alienWidth / 2 &&
        shot.x < ship.x + ship.alienWidth / 2 &&
        shot.y - shot.length > ship.y - ship.alienHeight / 2 &&
        shot.y - shot.length < ship.y + ship.alienHeight / 2 &&
        !shot.hit && ship.alive
      ) {
        ship.alive = false;
        shot.hit = true;
        score += ship.points; 
      }
    }
  }
}


function allAliensKilled() {
  let bool = true;
  for (let ship of ships) {
    if (ship.alive) {
      bool = false;
    }
  }
  return bool;
}


function resetAliens() {
  createAllAliens();
  if (speed > 2) {
    speed -= 2;
  }
  chanceOfFiringLaser += 10;

}

function fireLaser() {
  
  if (random(100) < chanceOfFiringLaser) {
    let i = floor(random(ships.length));
    if (ships[i].alive) {
      let l = new Laser(ships[i].x, ships[i].y + (ships[i].alienHeight / 2), laserSpeed, white);
      lasers.push(l);
    }
  }
}


function drawAllLasers() {
  for (let laser of lasers) {
    laser.draw();
  }
}


function moveAllLasers() {
  for (let laser of lasers) {
    laser.move();
  }
}


function drawScore() {
  noStroke();
  fill(255);
  textSize(10);
  textAlign(LEFT);
  text('LIVES: ', width - 175, 28);
  text('SCORE:', 25, 28);
  
  if (highScore > 0 && score > highScore) {
    fill(red);
  }
  text(score, 85, 28);
}






function hitPlayer() {
  for (let laser of lasers) {
    let leftEdgeOfLaser = laser.x - 2;
    let rightEdgeOfLaser = laser.x + 2;
    let frontOfLaser = laser.y + 8;
    let backOfLaser = laser.y;
    let leftEdgeOfShip = player.x - 3;
    let rightEdgeOfShip = player.x + 18;
    let frontOfShip = player.y - 19;
    let backOfShip = player.y + 8;


    
    

    
    if (rightEdgeOfLaser > leftEdgeOfShip &&
      leftEdgeOfLaser < rightEdgeOfShip &&
      frontOfLaser > frontOfShip &&
      backOfLaser < backOfShip &&
      !laser.used) {
      print('player hit!!!');
      laser.used = true; 
      if (player.lives > 0) {
        lifeLost();
      }
      if (player.lives == 0) {
        gameOver();
      }
    }
  }
}






function levelUp() {}






function lifeLost() {
  pauseTime = frameCount;
  print('life lost!');
  player.color = red;
  pauseMode = true;
}

function lifeGain(){
  player.lives += 1;
}





function animateNewLife() {
  print('animating new life');
  
  if ((frameCount - pauseTime > 5 && frameCount - pauseTime < 10) ||
    (frameCount - pauseTime > 15 && frameCount - pauseTime < 20) ||
    (frameCount - pauseTime > 25 && frameCount - pauseTime < 30)
  ) {
    noStroke();
    fill(207,194,135);
    rectMode(CORNER);
    
    rect(player.x - 2, player.y - 19,
      19, 28)
    
  }
  
  
  
  
  
  
  if (frameCount - pauseTime > 30) {
    player.color = black;
    player.x = width / 2;
    pauseMode = false;
    player.lives -= 1;
    
    for (let laser of lasers) {
      laser.used = true;
    }
    
    for (let shot of shots) {
      shot.hit = true;
    }
  }
}


function clearAllLasers() {}






function gameOver() {
  gameOverBool = true;
  background(0);
  print('game over!');
  textSize(30);
  stroke(0);
  fill(255);
  textAlign(CENTER);
  text('GAME OVER', width / 2, height / 2 - 100);
  textSize(20);

  /////////   Marcus   ///////////////<<<<
  
  text('Score: ' + score, width / 2, height / 2 + 40);
  if (score > highScore) {
    stroke(255)
    strokeWeight(2)
    fill(random(255), random(255), random(255));
    text('NEW HIGH SCORE!', width / 2, height / 2 + 75);
    fill(random(255), random(255), random(255));
  }
  text("Press 'ENTER'\nto play again!", width / 2, height / 2 + 125);
  noLoop();
}

//////////////////////////>>>>


/////////////// Marcus ///////////////////////////////////////<<<<

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  
  if (axis === Y_AXIS) {  // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {  // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

///////////////////////////////////////////////////////>>>>






function reset() {
  highScore = score;
  score = 0;
  player = new MyShip();
  createAllAliens();
  for (let laser of lasers) {
    laser.used = true;
  }
  
  for (let shot of shots) {
    shot.hit = true;
  }
  loop();
}

