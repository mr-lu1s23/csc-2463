let filter, effect, synth, polySynth, rev;
let activeKey = null;
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
  filter = new Tone.Filter(750, "lowpass").toDestination();
  effect = new Tone.Reverb(3).connect(filter);
  synth = new Tone.PolySynth().connect(effect);
  synth.set({
    envelope: {
      attack : 1,
      decay : 0.2,
      sustain : 0.7,
      release : 2,
    }
  })
  textSize(14);
  rev = createSlider(1, 5, 3, 1);
  rev.position(10, 80);
  rev.input(() => {effect.set({
    decay : rev.value()
  })});
}

function draw() {
  background(220);
  text('Simple Web Synthesizer', 10, 20);
  text('Use [A] [S] [D] [F] [G] [H] [J] [K] to play notes', 10, 40);
  text('Reverb: ' + rev.value(), 10, 70);
}

function keyPressed() {
  let pitch = keynotes[key];
  synth.triggerAttack(pitch);
}

function keyReleased() {
  synth.triggerRelease(keynotes[key]);
}