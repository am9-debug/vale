const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const messageContainer = document.getElementById('message-container');

// Configuration for physics
const PROXIMITY_BUFFER = 150; // How close cursor must be to trigger move

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
    // Simple approach: random coordinates within viewport
    // but kept somewhat centralized so it doesn't disappear off edges completely
    const maxX = window.innerWidth - noBtn.offsetWidth - 50;
    const maxY = window.innerHeight - noBtn.offsetHeight - 50;
    
    const randomX = Math.max(50, Math.random() * maxX);
    const randomY = Math.max(50, Math.random() * maxY);

    // Switch to fixed positioning so it can roam freely
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.transform = 'none'; // Reset initial transform
}

function moveYesButtonCloser(cursorX, cursorY) {
    // Make YES button absolute/fixed so it can move freely
    yesBtn.style.position = 'fixed';
    
    // Target: We want YES to be near the cursor, acting like a magnet
    // We offset it slightly so it doesn't instantly click itself
    const offsetX = 50; 
    const offsetY = 20;

    yesBtn.style.left = `${cursorX - offsetX}px`;
    yesBtn.style.top = `${cursorY - offsetY}px`;
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
