// Title: Classic Space Invaders
// Author: Daniel Kaye
// site: http://www.dnkaye.com/2020_CodingChallenges.html

class MyShip {
  constructor() {
    this.x = width / 2 
    this.y = height - 20;
    this.shipWidth = 26;
    this.shipHeight = 8;
    this.cannonWidth = 5;
    this.direction = 'none';
    this.lives = 3;
    this.shotInterval = 5;
    this.lastShotFiredTimestamp = -this.shotInterval;
    this.color = black; 
  }

  // draws the player
  drawPlayer() {
    fill(this.color);
    rectMode(CENTER);
    noStroke();
    this.drawShip(this.x, this.y);
  }

  drawExtraLives() {
    fill(red);
    let x = width - 105;
    for (let i = 0; i < this.lives; i++) {
      this.drawLives(x, 17, 14);
      x += 30;
    }
  }

  // stores and draws geometry for player's ship
  drawShip(x, y) {
  rectMode(CORNER);
  fill(140, 70, 20);
  rect(x-2, y-12, 3, 20)
  rect(x+14, y-12, 3, 20)
  fill(this.color);
  ellipse(x+7.5, y+1, 15, 8);
  quad(x, y, x+15, y, x+13, y-16, x+2, y-16);
  rect(x+0.5, y-19, 14, 4, 2)
  ellipse(x+7.5, y+4, 6)
  stroke(100)
  strokeWeight(1);
  line(x+2,y-14, x+13, y-14)
  line(x,y-2, x+15, y-2)
  }

drawLives(x, y, size){
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

  move() {
    if(!pauseMode){
      if (this.direction === 'left' && this.x - 2 > 3) {
        this.x -= 5;
      }
      if (this.direction === 'right' && this.x + 17 < 397) {
        this.x += 5;
      }
    }
  }

  changeDirection(direction) {
    this.direction = direction;
  }

  fire() {
    //  only fires a shot if last shot was fired more than 10 frames ago
    if (frameCount - this.lastShotFiredTimestamp > this.shotInterval) {
      shots.push(new Shot(this.x, this.y - (this.shipHeight), 1));
      this.lastShotFiredTimestamp = frameCount; // records time at which this shot was fired
    }
  }
}