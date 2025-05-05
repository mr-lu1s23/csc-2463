// Different states that the game will be in
let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});
// Dictates the behaviour of the game at the given state
let gameState = GameStates.START
let score = 0; // Increments for every bug squished
let time = 30; // Time in seconds to squish as much bugs as possible

let bug; // Holds the bug spritesheet
let bugs = []; // Holds all the bugs that will be in the game

let port;
let connect_btn;
let zero_btn;
let cursor;
let cursor_x;
let cursor_y;
let sensitivity = 2;
let is_just_pressed = false;

// Synths and parts for the synths
let bass_synth, melody_synth, main_part_bass, main_part_mel;
let squish; // Squish sound effect
let play_squish; // Avoids error when multiple bugs get squished at once
//                    and the game tries to play the sample multiple
//                    times at once.
let default_bpm = 180;

function preload() {
  bug = loadImage("media/bug.png");
  squish = new Tone.Player('media/squitch.wav').toDestination();
  cursor = loadImage('media/cursor.png');
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);

  // Creating the bugs
  for (i = 0; i < 30; i++){
    bugs[i] = new Bug(random(32, width - 32), random(32, height - 32));
    bugs[i].addAnimation("walk", new SpriteAnimation(bug, 0, 0, 4));
    bugs[i].addAnimation("squish", new SpriteAnimation(bug, 4, 0, 1));
    bugs[i].current_animation = "walk";
  }

  // Setting up the sound
  Tone.Transport.timeSignature = [3, 4];
  Tone.Transport.bpm.value = default_bpm;
  bass_synth = new Tone.PolySynth(Tone.Synth, {
    oscillator:
    {
      type: 'triangle',
      volume: -8
    },
    envelope:
    {
      attack: 0.025,
      release: 2
    }
  }).toDestination();
  melody_synth = new Tone.PolySynth(Tone.Synth, {
    oscillator:
    {
      type: 'sine',
      volume: -12
    },
    envelope:
    {
      attack: 0.1,
      decay: 0.25,
      sustain: 0.85,
      release: 0.25
    }
  }).toDestination();
  main_part_bass = new Tone.Part(((time, value) => {
      bass_synth.triggerAttackRelease(value.note, value.dur, time);
    }),
    [
      {time: 0, note: 'C4', dur: '16n'},
      {time: '0:1', note: 'E4', dur: '16n'},
      {time: '0:2', note: 'E4', dur: '16n'},
      {time: '1:0', note: 'C4', dur: '16n'},
      {time: '1:1', note: 'E4', dur: '16n'},
      {time: '1:2', note: 'E4', dur: '16n'},
      {time: '2:0', note: 'F3', dur: '16n'},
      {time: '2:1', note: 'A3', dur: '16n'},
      {time: '2:2', note: 'A3', dur: '16n'},
      {time: '3:0', note: 'F3', dur: '16n'},
      {time: '3:1', note: 'A3', dur: '16n'},
      {time: '3:2', note: 'B3', dur: '16n'},
    ]
  );
  main_part_bass.loop = true;
  main_part_bass.loopEnd = '4m';
  main_part_mel = new Tone.Part(((time, value) => {
      melody_synth.triggerAttackRelease(value.note, value.dur, time);
    }),
    [
      {time: '4:0', note: 'C5', dur: '2n'},
      {time: '5:0', note: 'A4', dur: '2n'},
      {time: '6:0', note: 'F4', dur: '4n'},
      {time: '6:1', note: 'G4', dur: '4n'},
      {time: '6:2', note: 'A4', dur: '4n'},
      {time: '7:0', note: 'G4', dur: '2n'},
      {time: '8:0', note: 'C5', dur: '2n'},
      {time: '9:0', note: 'A4', dur: '2n'},
      {time: '10:0', note: 'F4', dur: '4n'},
      {time: '10:1', note: 'G4', dur: '4n'},
      {time: '10:2', note: 'A4', dur: '4n'},
      {time: '11:0', note: 'B4', dur: '2n'},
      {time: '12:0', note: 'C5', dur: '2n'},
      {time: '13:0', note: 'E5', dur: '2n'},
      {time: '14:0', note: 'D5', dur: '4n'},
      {time: '14:1', note: 'C5', dur: '4n'},
      {time: '14:2', note: 'A4', dur: '4n'},
      {time: '15:0', note: 'G4', dur: '2n'},
      {time: '16:0', note: 'F4', dur: '4n'},
      {time: '16:1', note: 'G4', dur: '4n'},
      {time: '16:2', note: 'A4', dur: '4n'},
      {time: '17:0', note: 'A4', dur: '4n'},
      {time: '17:1', note: 'B4', dur: '4n'},
      {time: '17:2', note: 'D5', dur: '4n'},
      {time: '18:0', note: 'C5', dur: '1n'}
    ]
  );
  main_part_mel.loop = true;
  main_part_mel.loopEnd = '20m';
  play_squish = false;

  // Setting up serial communication
  port = createSerial();
  connect_btn = createButton('Connect to Arduino');
  connect_btn.position(0, 400);
  connect_btn.mousePressed(connect);
  zero_btn = createButton('Zero Joystick');
  zero_btn.position(130, 400);
  zero_btn.mouseClicked(zero);

  cursor_x = 200;
  cursor_y = 150;
}

function draw() {
  background(220);
  let sr;

  switch (gameState){
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("PRESS THE BUTTON TO START", width/2, height/2);
      image(cursor, cursor_x, cursor_y);

      sr = readSerial();
      if (sr.length != 0) {
        if (sr[2] == 1) {
          if (!is_just_pressed) {
            joystickClicked();
            is_just_pressed = true;
          }
        }
        else {
          is_just_pressed = false;
        }
      }

      break;
    case GameStates.PLAY:
      for (i = 0; i < bugs.length; i++) {
        bugs[i].speed = 1 + 0.5 * score; // Making the bugs faster as more bugs are squished
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
        gameState = GameStates.END;
        Tone.Transport.bpm.value = default_bpm;
      }

      if (play_squish)
      {
        squish.start();
        if (port.opened()) {
          port.write('squish\n');
        }
        play_squish = false;
      }
      
      sr = readSerial();
      if (sr.length != 0) {
        if (sr[2] == 1) {
          if (!is_just_pressed) {
            joystickClicked();
            is_just_pressed = true;
          }
        }
        else {
          is_just_pressed = false;
        }

        moveCursor(sr[0], sr[1]);
      }

      image(cursor, cursor_x, cursor_y);

      break;
    case GameStates.END:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("GAME OVER", width/2, height/2 - 10);
      text("Score: " + score, width/2, height/2 + 10);
      break;
  }
}

function joystickClicked(){
  switch (gameState){
    case GameStates.START:
      gameState = GameStates.PLAY;
      Tone.Transport.start();
      main_part_bass.start();
      main_part_mel.start();
      break;
    case GameStates.PLAY:
      for (x = 0; x < bugs.length; x++) {
        bugs[x].joystickClicked();
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
        // Use sin() and cos() to move the bug appropriately
        // sin() and cos() are used weirdly here due to how the sprite is oriented
        this.y += -cos(this.rotation) * this.speed;
        this.x += sin(this.rotation) * this.speed;

        // If the bug leaves the screen, wrap it around to the opposite side
        if (this.y <= -64 && (this.rotation < 90 || this.rotation > 270)) { // moving up
          this.y += height + 128;
        }
        else if (this.y >= height + 64 && this.rotation > 90 && this.rotation < 270) { // moving down
          this.y -= height + 128;
        }

        if (this.x >= width + 64 && this.rotation > 0 && this.rotation < 180) { // moving right
          this.x -= width + 128;
        }
        else if (this.x <= -64 && this.rotation < 360 && this.rotation > 180) { // moving left
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

  joystickClicked() {
    switch(this.current_animation){
      case "walk":
        // Is the cursor within a 30 pixel radius of the bug?
        let a2 = pow(this.x - cursor_x, 2);
        let b2 = pow(this.y - cursor_y, 2);
        let c = sqrt(a2 + b2);
        if (c <= 30){
          this.current_animation = "squish";
          score++;
          Tone.Transport.bpm.value += 10;
          play_squish = true;
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

function connect() {
  port.open('Arduino', 9600);
}

function zero() {
  if (port.opened()) {
    port.write('zero\n');
  }
}

function readSerial() {
  let ser = port.readUntil('\n');
  if (ser != '') {
    let vals = ser.split(',');
    if (vals.length == 3) {
      vals[0] = int(vals[0]);
      vals[1] = int(vals[1]);
      vals[2] = int(vals[2]);
      return vals;
    }
    else {
      print(ser);
    }
  }
  return [];
}

function moveCursor(changeX, changeY) {
  let _cx = map(changeX, -504, 519, -1, 1) * sensitivity;
  let _cy = map(changeY, -501, 522, -1, 1) * sensitivity;
  cursor_x = clamp(cursor_x + _cx, 0, 400);
  cursor_y = clamp(cursor_y + _cy, 0, 400);
}

function clamp(value, min, max) {
  if (value < min)
    return min;
  else if (value > max)
    return max;
  else
    return value;
}
