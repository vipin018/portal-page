const numStars = 800;
let stars = [];
let portalSize; // Will be calculated dynamically
let scrollYAmount = 0;
let transitioning = false;

const colors = [
  [0, 150, 255],   // Blue
  [255, 200, 0],   // Yellow
  [255, 100, 0],   // Orange
  [255, 255, 255]  // White
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(2);
  updatePortalSize(); // Set initial portal size
  resetStars(); // Initialize stars with responsive positions
}

function draw() {
  background(0, 20);
  const acc = map(mouseX, 0, width, 0.005, 0.2);

  stars = stars.filter(star => {
    star.draw();
    star.update(acc);
    return star.isActive();
  });

  while (stars.length < numStars) {
    stars.push(new Star(random(width), random(height)));
  }

  drawGlowingPortal();
  if (portalSize > min(width, height) * 0.6 && !transitioning) { // Adjusted threshold
    triggerPageTransition();
  }
}

class Star {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.prevPos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.ang = atan2(y - height / 2, x - width / 2);
    this.color = random(colors);
  }

  isActive() {
    return onScreen(this.prevPos.x, this.prevPos.y);
  }

  update(acc) {
    this.vel.x += cos(this.ang) * acc;
    this.vel.y += sin(this.ang) * acc;

    this.prevPos.set(this.pos);
    this.pos.add(this.vel);

    if (frameCount % 10 === 0) {
      this.color = random(colors);
    }
  }

  draw() {
    const alpha = map(this.vel.mag(), 0, 3, 100, 255);
    stroke(this.color[0], this.color[1], this.color[2], alpha);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
  }
}

function onScreen(x, y) {
  return x >= 0 && x <= width && y >= 0 && y <= height;
}

function drawGlowingPortal() {
  push();
  translate(width / 2, height / 2);
  noFill();

  // Pulsing effect scaled to canvas size
  let pulse = sin(frameCount * 0.03) * min(width, height) * 0.03; // Responsive pulse
  let baseSize = portalSize + pulse;

  // Inner dark core
  stroke(20, 20, 20, 255); // Dark gray center
  strokeWeight(min(width, height) * 0.015); // Responsive thickness
  ellipse(0, 0, baseSize * 0.4, baseSize * 0.4);

  // Smooth gradient from dark center to light edges
  for (let i = 0; i < 20; i++) {
    let gradientFactor = i / 20;
    let r = lerp(20, 255, gradientFactor);
    let g = lerp(20, 255, gradientFactor);
    let b = lerp(20, 0, gradientFactor);
    let alpha = lerp(255, 30, gradientFactor);
    let layerSize = baseSize * (0.4 + gradientFactor * 0.7);
    stroke(r, g, b, alpha);
    strokeWeight(min(width, height) * 0.02 - i * 0.0008 * min(width, height)); // Responsive gradient thickness
    ellipse(0, 0, layerSize, layerSize);
  }

  // Swirling vortex
  for (let i = 0; i < 6; i++) {
    let swirlAngle = frameCount * 0.15 + i * TWO_PI / 6;
    let swirlSize = baseSize * (0.7 - i * 0.08);
    stroke(255, 215, 0, 180 - i * 25);
    strokeWeight(min(width, height) * 0.003); // Responsive swirl thickness
    push();
    rotate(swirlAngle);
    arc(0, 0, swirlSize, swirlSize, 0, PI / 3);
    pop();
  }

  // Outer rim with arc-like fading edges
  let rimAlpha = map(sin(frameCount * 0.05), -1, 1, 50, 100);
  stroke(255, 255, 0, rimAlpha);
  strokeWeight(min(width, height) * 0.008); // Responsive rim thickness
  arc(0, 0, baseSize * 1.1, baseSize * 1.1, PI / 4, (7 * PI) / 4);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updatePortalSize(); // Recalculate portal size on resize
  resetStars(); // Reset stars to fit new canvas size
}

function updatePortalSize() {
  // Set portalSize as a fraction of the smaller canvas dimension
  portalSize = min(width, height) * 0.5; // 50% of smaller dimension
}

function resetStars() {
  stars = []; // Clear existing stars
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star(random(width), random(height))); // Respawn stars
  }
}

function triggerPageTransition() {
  transitioning = true;
  console.log("Transition triggered!");
}
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container'); // Attach canvas to the container
    strokeWeight(2);
    updatePortalSize();
    resetStars();
  }
