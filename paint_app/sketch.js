let palette_l = 1, palette_r = 21;

function setup() {
  let c = createCanvas(600, 375);
  c.position((windowWidth / 2) - (width / 2), (windowHeight / 2) - (height / 2));
  background(230);

  // Drawing Palette
  setup_palette();

  // Set the default color to black
  stroke(0, 0, 0);
  strokeWeight(5);
}

function mousePressed() {
  // Check to see if the mouse is inside the color palette portion
  if (mouseX >= palette_l && mouseX <= palette_r) {
    // If it is, select the correct color
    if (mouseY >= 1 && mouseY <= 21) { // Black
      stroke(0, 0, 0);
    }
    else if (mouseY >= 22 && mouseY <= 42) { // White
      stroke(255, 255, 255);
    }
    else if (mouseY >= 43 && mouseY <= 63) { // Red
      stroke(255, 0, 0);
    }
    else if (mouseY >= 64 && mouseY <= 84) { // Orange
      stroke(255, 153, 0);
    }
    else if (mouseY >= 85 && mouseY <= 105) { // Yellow
      stroke(255, 255, 0);
    }
    else if (mouseY >= 106 && mouseY <= 126) { // Green
      stroke(0, 220, 0);
    }
    else if (mouseY >= 127 && mouseY <= 147) { // Cyan
      stroke(0, 255, 255);
    }
    else if (mouseY >= 148 && mouseY <= 168) { // Blue
      stroke(0, 0, 255);
    }
    else if (mouseY >= 169 && mouseY <= 189) { // Magenta
      stroke(225, 0, 255);
    }
    else if (mouseY >= 190 && mouseY <= 210) { // Brown
      stroke(153, 51, 0);
    }
  }
}

function mouseDragged() {
  // Only allow drawing on the canvas portion
  if ((pmouseX > 26 && mouseX > 26) || (pmouseY > 215 && mouseY > 215)) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

// Draws the palette
function setup_palette() {
  noStroke();
  fill(0, 0, 0); // Black
  square(palette_l, 1, 20);
  fill(255, 255, 255); // White
  square(palette_l, 22, 20);
  fill(255, 0, 0); // Red
  square(palette_l, 43, 20);
  fill(255, 153, 0); // Orange
  square(palette_l, 64, 20);
  fill(255, 255, 0); // Yellow
  square(palette_l, 85, 20);
  fill(0, 220, 0); // Green
  square(palette_l, 106, 20);
  fill(0, 255, 255); // Cyan
  square(palette_l, 127, 20); 
  fill(0, 0, 255); // Blue
  square(palette_l, 148, 20);
  fill(255, 0, 255); // Magenta
  square(palette_l, 169, 20);
  fill(153, 51, 0); // Brown
  square(palette_l, 190, 20);
}
