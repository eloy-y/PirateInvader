class Shot {
    constructor(x, y, dir) {
      this.x = x + 10;
      this.y = y - 10;
      this.direction = dir; // positive for up, negative for down
      this.length = 5;
      this.hit = false;
  }

  draw() {
    if (!this.hit) {
      fill(black);
      strokeWeight(2);
      ellipse(this.x, this.y, 3, 3);
      if (this.y < 0) {
        shots.splice(0, 1); // removes shot once it leaves screen
      }
    }
  }

  move() {
    this.y -= 12;
  }
}