let samples;
let button1, button2, button3, button4;
let del = new Tone.FeedbackDelay(0.5, 0.5).toDestination();

function preload(){
  samples = new Tone.Players({
    boxed_tissue: "media/boxed-tissue-pull-4.wav",
    grand_piano: "media/grand-piano-dang-dang.wav",
    keychron: "media/keychron-k10-space_bar.wav",
    pan_hit: "media/pan-hit.wav"
  }).connect(del);
}

function setup() {
  createCanvas(400, 400);
  textSize(16);
  button1 = createButton("Boxed Tissue");
  button1.position(10, 10);
  button2 = createButton("Grand Piano Dang-Dang");
  button2.position(200, 10);
  button3 = createButton("Keychron K10 Space Bar");
  button3.position(10, 50);
  button4 = createButton("Pan Hit");
  button4.position(200, 50);
  button1.mousePressed(() => {samples.player("boxed_tissue").start()});
  button2.mousePressed(() => {samples.player("grand_piano").start()});
  button3.mousePressed(() => {samples.player("keychron").start()});
  button4.mousePressed(() => {samples.player("pan_hit").start()});
  delTimeSlider = createSlider(0, 1, 0, 0.01);
  delTimeSlider.position(10, 105);
  delTimeSlider.input(() => {del.delayTime.value = delTimeSlider.value()});
}

function draw() {
  background(220);
  text("Delay Time: " + delTimeSlider.value(), 10, 100);
}
