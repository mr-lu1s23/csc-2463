let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});
let gameState = GameStates.START
let score = 0;
let time = 30;

let bug;
let bugs = [];

function preload() {
  bug = loadImage("media/bug.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);

  for (i = 0; i < 20; i++){
    bugs[i] = new Bug(random(64, width - 64), random(64, height - 64));
    bugs[i].addAnimation("walk", new SpriteAnimation(bug, 0, 0, 4));
    bugs[i].addAnimation("squish", new SpriteAnimation(bug, 4, 0, 1));
    bugs[i].current_animation = "walk";
  }
}

function draw() {
  background(220);

  switch (gameState){
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("PRESS ENTER TO START", width/2, height/2);
      break;
    case GameStates.PLAY:
      for (i = 0; i < bugs.length; i++) {
        bugs[i].speed = 1 + 0.5 * score;
        bugs[i].draw();
      }

      textSize(14);
      textAlign(LEFT, TOP);
      text("Score: " + score, 10, 10);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - 10, 10);

      time -= deltaTime / 1000;
      if (time <= 0)
      {
        gameState = GameStates.END
      }
      break
    case GameStates.END:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("GAME OVER", width/2, height/2 - 10);
      text("Score: " + score, width/2, height/2 + 10);
      break;
  }
}

function keyPressed(){
  switch (gameState){
    case GameStates.START:
      if (keyCode == ENTER)
      {
        gameState = GameStates.PLAY;
      }
    case GameStates.PLAY:
      break;
    case GameStates.END:
      break;
  }
}

function mousePressed(){
  switch (gameState) {
    case GameStates.PLAY:
      for (x = 0; x < bugs.length; x++) {
        bugs[x].mousePressed();
      }
  }
}

class Bug {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.animations = [];
    this.current_animation = null;
    this.rotation = random(0, 359);
    this.speed = 1;
  }

  addAnimation(key, animation) {
    this.animations[key] = animation
  }

  draw() {
    let animation = this.animations[this.current_animation];
    if (animation) {
      if (this.current_animation == "walk") {
        this.y += -cos(this.rotation) * this.speed;
        this.x += sin(this.rotation) * this.speed;

        if (this.y <= -64 && (this.rotation < 90 || this.rotation > 270)) {
          this.y += height + 128;
        }
        else if (this.y >= height + 64 && this.rotation > 90 && this.rotation < 270) {
          this.y -= height + 128;
        }

        if (this.x >= width + 64 && this.rotation > 0 && this.rotation < 180) {
          this.x -= width + 128;
        }
        else if (this.x <= -64 && this.rotation < 360 && this.rotation > 180) {
          this.x += width + 128;
        }
      }
      push();
      translate(this.x, this.y);
      rotate(this.rotation);
      animation.draw();
      pop();
    }
  }

  mousePressed() {
    switch(this.current_animation){
      case "walk":
        let a2 = pow(this.x - mouseX, 2);
        let b2 = pow(this.y - mouseY, 2);
        let c = sqrt(a2 + b2);
        if (c <= 30){
          this.current_animation = "squish";
          score++;
        }
    }
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
  }

  draw() {
    image(this.spritesheet, 0, 0, 64, 64, this.u*64, this.v*64, 64, 64);

    this.frameCount++;
    if (this.frameCount % 5 == 0) {
      this.u++;
    }

    if (this.u == this.startU + this.duration) {
      this.u = this.startU
    }
  }
}
