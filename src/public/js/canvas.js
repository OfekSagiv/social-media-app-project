document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) {
    console.error('Canvas element with id "background-canvas" not found.');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('2D context not available on the canvas element.');
    return;
  }

  const PARTICLE_COUNT = 80;
  const PARTICLE_RADIUS_MIN = 1;
  const PARTICLE_RADIUS_RANGE = 2;
  const PARTICLE_SPEED_FACTOR = 1.5;
  const PARTICLE_COLOR = 'rgba(66, 133, 244, 0.7)';
  const FULL_CIRCLE = Math.PI * 2;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle());

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: randomBetween(PARTICLE_RADIUS_MIN, PARTICLE_RADIUS_MIN + PARTICLE_RADIUS_RANGE),
      dx: randomBetween(-PARTICLE_SPEED_FACTOR / 2, PARTICLE_SPEED_FACTOR / 2),
      dy: randomBetween(-PARTICLE_SPEED_FACTOR / 2, PARTICLE_SPEED_FACTOR / 2),
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, FULL_CIRCLE);
      ctx.fillStyle = PARTICLE_COLOR;
      ctx.fill();

      particle.x += particle.dx;
      particle.y += particle.dy;

      if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
    }

    requestAnimationFrame(draw);
  }

  draw();
});
