const numStars = 500;
let stars = [];
let portalSize; // Dynamic size
let scrollYAmount = 0;
let transitioning = false;

const colors = [
    [0, 150, 255],   // Blue
    [255, 200, 0],   // Yellow
    [255, 100, 0],   // Orange
    [255, 255, 255]  // White
  ];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container'); // Attach to container
  strokeWeight(2);
  updatePortalSize();
  resetStars();
}

function draw() {
  background(0, 20); // Slight transparency for trail effect
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
  if (portalSize > min(width, height) * 0.6 && !transitioning) {
    triggerPageTransition();
  }
}

class Star {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.prevPos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.ang = atan2(y - height / 2, x - width / 2);
    this.color = random(colors); // Random color: white or black
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
      this.color = random(colors); // Update color periodically
    }
  }

  draw() {
    const alpha = map(this.vel.mag(), 0, 3, 100, 255);
    stroke(this.color[0], this.color[1], this.color[2], alpha); // Use white or black
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

  // Pulsing effect
  let pulse = sin(frameCount * 0.09) * min(width, height) * 0.05;
  let baseSize = portalSize + pulse + 15;

  // Dark core (tunnel entrance)
  stroke(20, 20, 20, 255); // Dark gray
  strokeWeight(max(width, height) * 0.0005);
  ellipse(0, 0, baseSize * 0.4, baseSize * 0.4);

  // Bright blue exit light at center
  let lightRadius = baseSize * 0.5;
  let lightAlpha = map(sin(frameCount * 0.5), -1, 1, 150, 255);
  stroke(0, 150, 255, lightAlpha); // Bright blue glow
  strokeWeight(min(width, height) * 0.01);
  ellipse(0, 0, lightRadius, lightRadius);

  // Swirling vortex with blue wavy lines
  for (let i = 0; i < 20; i++) {
    let angle = frameCount * 0.3 + i * TWO_PI / 20; // Slow rotation
    let dist = map(i, 0, 19, baseSize * 0.4, baseSize * 0.9); // From core to edge
    let waveOffset = sin(frameCount * 0.05 + i) * 10; // Simple wave

    let alpha = map(i, 0, 19, 200, 50); // Fade outward

    stroke(0, 150, 255, alpha); // Fixed blue color
    strokeWeight(min(width, height) * 0.09);
    push();
    rotate(angle);
    arc(0, waveOffset, dist, dist, 0, PI / 5); // Quarter-circle arcs for wave effect
    pop();
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updatePortalSize();
  resetStars();
}

function updatePortalSize() {
  portalSize = min(width, height) * 0.5;
}

function resetStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star(random(width), random(height)));
  }
}

function triggerPageTransition() {
  transitioning = true;
  console.log("Transition triggered!");
}
