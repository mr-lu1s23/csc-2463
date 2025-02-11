let guy;
let green;
let robot;
let guy_character;
let green_character;
let robot_character;

function preload() {
  guy = loadImage("media/SpelunkyGuy.png");
  green = loadImage("media/Green.png");
  robot = loadImage("media/Robot.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  guy_character = new Character(random(0, width - 80), random(0, height - 80));
  guy_character.addAnimation("idle", new SpriteAnimation(guy, 0, 0, 1));
  guy_character.addAnimation("walk_right", new SpriteAnimation(guy, 1, 0, 8));
  guy_character.addAnimation("walk_left", new SpriteAnimation(guy, 1, 0, 8));
  guy_character.currentAnimation = "idle";

  green_character = new Character(random(0, width - 80), random(0, height - 80));
  green_character.addAnimation("idle", new SpriteAnimation(green, 0, 0, 1));
  green_character.addAnimation("walk_right", new SpriteAnimation(green, 1, 0, 8));
  green_character.addAnimation("walk_left", new SpriteAnimation(green, 1, 0, 8));
  green_character.currentAnimation = "idle";

  robot_character = new Character(random(0, width - 80), random(0, height - 80));
  robot_character.addAnimation("idle", new SpriteAnimation(robot, 0, 0, 1));
  robot_character.addAnimation("walk_right", new SpriteAnimation(robot, 1, 0, 8));
  robot_character.addAnimation("walk_left", new SpriteAnimation(robot, 1, 0, 8));
  robot_character.currentAnimation = "idle";
}

function draw() {
  background(220);
  guy_character.draw();
  green_character.draw();
}

function keyPressed() {
  guy_character.keyPressed();
  green_character.keyPressed();
}

function keyReleased() {
  guy_character.keyReleased();
  green_character.keyReleased();
}

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = [];
    this.isFlipped = false;
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      switch(this.currentAnimation) {
        case "walk_right":
          this.x += 2;
          break;
        case "walk_left":
          this.x -= 2;
          break;
      }
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }
  
  keyPressed() {
    switch (keyCode) {
      case RIGHT_ARROW:
        this.currentAnimation = "walk_right";
        this.animations[this.currentAnimation].flipped = false;
        this.isFlipped = false;
        break;
      case LEFT_ARROW:
        this.currentAnimation = "walk_left";
        this.animations[this.currentAnimation].flipped = true;
        this.isFlipped = true;
        break;
    }
  }

  keyReleased() {
    this.currentAnimation = "idle";
    this.animations[this.currentAnimation].flipped = this.isFlipped;
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
    this.flipped = false;
  }

  draw() {
    let s = (this.flipped) ? -1 : 1;
    scale(s, 1);
    image(this.spritesheet, 0, 0, 80, 80, this.u*80, this.v*80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 5 == 0) {
      this.u++;
    }

    if (this.u == this.startU + this.duration) {
      this.u = this.startU
    }
  }
}
