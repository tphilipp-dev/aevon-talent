// ─── CANVAS & PARTICLES ───
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Functie om de canvas exact de grootte van zijn container te geven
function resizeCanvas() {
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
}

// Stel het formaat 1x in bij het laden
resizeCanvas();

const particles = [];
const particleCount = window.innerWidth < 768 ? 40 : 120;

// Maak de deeltjes aan
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.6 + 0.2
  });
}

// Teken de lijnen tussen de deeltjes
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(37, 99, 235, ${0.18 * (1 - dist / 160)})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animeer de boel
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.speedX; p.y += p.speedY;
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(37, 99, 235, ${p.opacity})`;
    ctx.fill();
  });
  drawLines();
  requestAnimationFrame(animate);
}
animate();

// FIX: Voorkom het "squish" effect op mobiel door de adresbalk
let cachedWidth = window.innerWidth;
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  // Alleen opnieuw schalen als de breedte écht verandert of op desktop
  if (newWidth !== cachedWidth || newWidth > 768) {
    resizeCanvas();
    cachedWidth = newWidth;
  }
});

// ─── SCROLL ANIMATIES (FADE-INS) ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => {
  observer.observe(el);
});

// ─── COOKIE BANNER ───
function handleCookie(accepted) {
  localStorage.setItem('cookieAccepted', accepted ? 'true' : 'false');
  document.getElementById('cookieBanner').style.display = 'none';
}

if (localStorage.getItem('cookieAccepted')) {
  document.getElementById('cookieBanner').style.display = 'none';
}

window.acceptCookie = () => handleCookie(true);
window.declineCookie = () => handleCookie(false);

// ─── PERFORMANCE OPTIMALISATIE VOOR MOBIEL ───
if (window.innerWidth < 768) {
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    // Verberg canvas als je voorbij de hero bent gescrold (scheelt batterij)
    canvas.style.opacity = heroBottom > 0 ? '1' : '0';
  });
}
