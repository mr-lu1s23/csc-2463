let filter, effect, synth;
let keynotes = {
  'a' : 'C5',
  's' : 'D5',
  'd' : 'E5',
  'f' : 'F5',
  'g' : 'G5',
  'h' : 'A5',
  'j' : 'B5',
  'k' : 'C6',
};

function setup() {
  createCanvas(400, 400);
  filter = new Tone.Filter(2000, "lowpass").toDestination();
  effect = new Tone.Reverb(3).connect(filter);
  synth = new Tone.PolySynth({
    envelope: {
      attack : 0.1,
      decay : 0.2,
      sustain : 0.9,
      release : 0.2,
    }
  }).connect(effect);
  textSize(14);
}

function draw() {
  background(220);
  text('Simple Web Synthesizer', 10, 20);
  text('Use [A] [S] [D] [F] [G] [H] [J] [K] to play notes', 10, 40);
}

function keyPressed() {
  let pitch = keynotes[key];
  synth.triggerAttack(pitch);
}

function keyReleased() {
  synth.triggerRelease(keynotes[key]);
}