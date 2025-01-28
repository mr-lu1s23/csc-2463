function setup() {
  createCanvas(200, 100);
}

function draw() {
  background(0);

  // Drawing Pac-Man
  noStroke();
  fill(255, 255, 0);
  arc(50, 50, 80, 80, PI + QUARTER_PI, HALF_PI + QUARTER_PI);

  // Drawing Blinky
  // Body
  fill(255, 0, 0);
  rect(110, 50, 80, 40);
  arc(150, 50, 80, 80, PI, 0);
  // Eyes
  strokeWeight(5);
  stroke(255, 255, 255)
  fill(0, 0, 255);
  circle(130, 50, 20);
  circle(170, 50, 20);
}
