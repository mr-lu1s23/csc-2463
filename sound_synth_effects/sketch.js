// Defining the oscillator, filter, LFO, and the image that will appear
let osc, filt, lfo, img;
// Defining the state that will control the oscillator, filter, and image
let state;

function preload() {
  // Loading the alarm image
  img = loadImage('media/alarm.jpg');
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  // Setting up filter
  filt = new Tone.Filter(800, 'lowpass').toDestination();
  // Setting up oscillator
  osc = new Tone.Oscillator({
    frequency: 400,
    type: 'square',
    volume: -12
  }).connect(filt);
  // Setting up the LFO
  lfo = new Tone.LFO('4n', 400, 800).connect(osc.frequency);
  lfo.set({
    type: 'triangle'
  });
  // Setting the initial state
  state = 'ready'
}

function draw() {
  background(220);
  switch(state) {
    case 'ready': // Image is not being displayed
      break;
    case 'clicked': // Display image
      image(img, 200, 200);
      break;
  }
}

function mousePressed() {
  switch(state){
    case 'ready': // Start the oscillator and LFO
      state = 'clicked';
      osc.start();
      lfo.start();
      break;
    case 'clicked': // Stop the oscillator and LFO
      state = 'ready';
      osc.stop();
      lfo.stop();
      break;
  }
}
