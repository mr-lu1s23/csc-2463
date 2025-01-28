function setup() {
  createCanvas(200, 200);
}

function draw() {
  background(255, 255, 255);

  // Drawing the circles
  noStroke();
  // Red Circle
  fill(255, 0, 0, 100);
  circle(100, 67, 100);
  // Green Cirle
  fill(0, 255, 0, 100);
  circle(134, 134, 100);
  // Blue Circle
  fill(0, 0, 255, 100);
  circle(67, 134, 100);
}
