(function () {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const result = document.getElementById("result");

  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;

  noBtn.style.position = "fixed";
  yesBtn.style.position = "fixed";

  noBtn.style.left = vw() * 0.6 + "px";
  noBtn.style.top = vh() * 0.55 + "px";

  yesBtn.style.left = vw() * 0.4 + "px";
  yesBtn.style.top = vh() * 0.55 + "px";

  const proximity = 140;
  const escapeDist = 130;
  let lastMove = 0;

  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function moveNo(mx, my) {
    const now = Date.now();
    if (now - lastMove < 160) return;
    lastMove = now;

    const c = center(noBtn);
    const angle = Math.atan2(my - c.y, mx - c.x) + Math.PI;

    let nx = c.x + Math.cos(angle) * escapeDist;
    let ny = c.y + Math.sin(angle) * escapeDist;

    nx = clamp(nx, 20, vw() - 120);
    ny = clamp(ny, 20, vh() - 80);

    noBtn.style.left = nx + "px";
    noBtn.style.top = ny + "px";

    // running effect
    noBtn.classList.add("no-running");
    setTimeout(() => noBtn.classList.remove("no-running"), 300);
  }

  function moveYes(mx, my) {
    yesBtn.style.left = mx - 70 + "px";
    yesBtn.style.top = my - 40 + "px";
  }

  document.addEventListener("mousemove", (e) => {
    const c = center(noBtn);
    const d = Math.hypot(e.clientX - c.x, e.clientY - c.y);

    if (d < proximity) {
      moveNo(e.clientX, e.clientY);
      moveYes(e.clientX, e.clientY);
    }
  });

  // prevent NO from ever being clicked
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  // GRAND YES LOVE ANIMATION
  yesBtn.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "love-overlay";

    const msg = document.createElement("div");
    msg.className = "love-message";
    msg.innerHTML = `
      <h1>YAY ❤️</h1>
      <p>You just made me the happiest person alive 💖</p>
    `;

    overlay.appendChild(msg);
    document.body.appendChild(overlay);

    // floating hearts
    for (let i = 0; i < 30; i++) {
      const h = document.createElement("div");
      h.className = "heart";
      h.textContent = "💖";
      h.style.left = Math.random() * 100 + "vw";
      h.style.animationDelay = Math.random() * 2 + "s";
      overlay.appendChild(h);
    }
  });
})();
