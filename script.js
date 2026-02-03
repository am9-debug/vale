const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const messageContainer = document.getElementById('message-container');
const glassCard = document.querySelector('.glass-card');

// Configuration for physics
const PROXIMITY_BUFFER = 150; // How close cursor must be to trigger move
const MOVE_DISTANCE = 100;    // How far NO jumps
const YES_MAGNET_STRENGTH = 0.8; // How much YES moves toward cursor (0-1)

// Track state
let isChasing = false;

document.addEventListener('mousemove', (e) => {
    // Get button positions
    const noRect = noBtn.getBoundingClientRect();
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;

    // Calculate distance from cursor to NO button
    const distance = Math.hypot(e.clientX - noCenterX, e.clientY - noCenterY);

    // If cursor is close to NO, trigger the "Hide & Seek"
    if (distance < PROXIMITY_BUFFER) {
        moveNoButton();
        moveYesButtonCloser(e.clientX, e.clientY);
    }
});

function moveNoButton() {
    // 1. Add cheesy wiggle animation
    noBtn.classList.add('wiggle');
    setTimeout(() => noBtn.classList.remove('wiggle'), 400);

    // 2. Calculate new random position (playful hop)
    // We get the card dimensions to keep the button relatively contained or let it go wild
    // Here we let it move semi-randomly but try to keep it on screen
    const xOffset = (Math.random() - 0.5) * 300; 
    const yOffset = (Math.random() - 0.5) * 300;

    // Apply translation using CSS transform to keep it smooth
    // We add current position logic if needed, but simple random offsets work best for "chaos"
    // To ensure it doesn't fly off screen, we clamp it slightly or just let it roam:
    
    // Simple approach: random coordinates within viewport
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    // Switch to fixed positioning for the NO button so it can really run away
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.transform = 'none'; // Reset initial transform
}

function moveYesButtonCloser(cursorX, cursorY) {
    // Make YES button absolute/fixed so it can move freely
    yesBtn.style.position = 'fixed';
    
    // Current YES position
    const yesRect = yesBtn.getBoundingClientRect();
    
    // Target: We want YES to be near the cursor, but not covering it immediately
    // Let's make it "lag" slightly behind the cursor for a magnetic effect
    const currentX = yesRect.left;
    const currentY = yesRect.top;
    
    // Move 10% of the way to the cursor (smooth lerp)
    const newX = currentX + (cursorX - currentX) * 0.05;
    const newY = currentY + (cursorY - currentY) * 0.05;

    yesBtn.style.left = `${newX}px`;
    yesBtn.style.top = `${newY}px`;
    yesBtn.style.transform = 'none'; // Reset initial transform
}

// --- CLICK HANDLERS ---

noBtn.addEventListener('click', (e) => {
    // Just in case they manage to click it (touchscreen or super fast)
    e.preventDefault();
    alert("Nice try! But you can't say no to this face. 😜");
    moveNoButton();
});

yesBtn.addEventListener('click', () => {
    // 1. Grand Finale Visuals
    messageContainer.classList.remove('hidden');
    document.querySelector('.button-area').style.display = 'none';
    document.querySelector('.question').style.display = 'none';
    
    // 2. Confetti Explosion
    launchConfetti();
});

function launchConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}
