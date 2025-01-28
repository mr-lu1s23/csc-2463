function setup() {
  createCanvas(200, 200);
}

function draw() {
  background(0, 0, 153);

  // Drawing Circle
  stroke(255, 255, 255);
  strokeWeight(3);
  fill(0, 153, 51);
  circle(100, 100, 100);

  // Drawing Star
  fill(255, 51, 0);
  beginShape();
  vertex(100, 50); // Top of Star
  vertex(110, 85);
  vertex(150, 85); // Rightmost Point
  vertex(120, 105);
  vertex(130, 145); // Bottom-right Point
  vertex(100, 120);
  vertex(70, 145); // Bottom-left Point
  vertex(80, 105);
  vertex(50, 85); // Leftmost Point
  vertex(90, 85);
  endShape(CLOSE);
}
