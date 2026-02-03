// Cheesy hide-and-seek + visuals + sound
(function () {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const result = document.getElementById("result");

  if (!noBtn || !yesBtn) {
    console.error("Buttons not found. Make sure #yes and #no exist.");
    return;
  }

  // viewport helpers
  const vw = () => Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = () => Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  const placeInitial = () => {
    yesBtn.style.left = Math.round(vw() * 0.40) + "px";
    yesBtn.style.top  = Math.round(vh() * 0.55) + "px";

    noBtn.style.left  = Math.round(vw() * 0.60) + "px";
    noBtn.style.top   = Math.round(vh() * 0.55) + "px";
  };
  placeInitial();
  window.addEventListener("resize", placeInitial);

  // settings
  const proximityThreshold = 140;
  const noMoveDistance = 110;
  const minGap = 90;
  let lastNoMove = 0;
  const noMoveCooldown = 180;

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const centerOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  };
  const keepInside = (x, y, bw, bh) => {
    const margin = 12;
    const maxX = vw() - bw - margin;
    const maxY = vh() - bh - margin;
    const nx = clamp(x, margin, maxX);
    const ny = clamp(y, margin, maxY);
    return { x: nx, y: ny };
  };

  // Create a tiny in-browser 'boop' sound (no external files)
  function playCheesySound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(720, ctx.currentTime); // start
      o.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.12);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.18);
      // close context after short delay to free resources
      setTimeout(() => {
        if (ctx && ctx.state !== "closed") try { ctx.close(); } catch (e) {}
      }, 400);
    } catch (err) {
      // ignore if AudioContext blocked or unavailable
      // console.warn("Audio not available", err);
    }
  }

  // spawn a temporary emoji at x,y (page coords)
  function spawnEmoji(x, y) {
    const emojis = ["💥","😜","😉","✨","💫","💕"];
    const ch = emojis[Math.floor(Math.random() * emojis.length)];
    const el = document.createElement("div");
    el.className = "pop-emoji";
    el.textContent = ch;
    // position center relative to page
    el.style.left = Math.round(x) + "px";
    el.style.top  = Math.round(y) + "px";
    document.body.appendChild(el);
    // remove after animation ends (safe fallback)
    el.addEventListener("animationend", () => el.remove());
    setTimeout(() => { if (el.parentNode) el.remove(); }, 1000);
  }

  // move YES toward cursor, avoid overlapping NO
  const moveYesToward = (mouseX, mouseY) => {
    const bw = yesBtn.offsetWidth, bh = yesBtn.offsetHeight;
    const offsetX = 70;
    const offsetY = 35;

    let targetX = mouseX - offsetX;
    let targetY = mouseY - offsetY;

    const inside = keepInside(targetX, targetY, bw, bh);
    targetX = inside.x; targetY = inside.y;

    const noC = centerOf(noBtn);
    const yesCenterX = targetX + bw / 2;
    const yesCenterY = targetY + bh / 2;
    const dist = Math.hypot(yesCenterX - noC.x, yesCenterY - noC.y);

    if (dist < minGap) {
      const dx = mouseX - noC.x;
      const dy = mouseY - noC.y;
      const signX = dx >= 0 ? 1 : -1;
      const signY = dy >= 0 ? 1 : -1;
      let altX = mouseX + signX * (offsetX + 40);
      let altY = mouseY + signY * (offsetY + 20);
      const altInside = keepInside(altX, altY, bw, bh);
      targetX = altInside.x;
      targetY = altInside.y;
    }

    yesBtn.style.left = Math.round(targetX) + "px";
    yesBtn.style.top  = Math.round(targetY) + "px";
  };

  // Move NO in short hops and trigger cheesy effects
  const moveNoAway = (mouseX, mouseY) => {
    const now = Date.now();
    if (now - lastNoMove < noMoveCooldown) return;
    lastNoMove = now;

    const bw = noBtn.offsetWidth, bh = noBtn.offsetHeight;
    const c = centerOf(noBtn);

    const angleToCursor = Math.atan2(mouseY - c.y, mouseX - c.x);
    const awayAngle = angleToCursor + Math.PI + (Math.random() - 0.5) * (Math.PI / 3);

    let targetX = c.x + Math.cos(awayAngle) * noMoveDistance - bw / 2;
    let targetY = c.y + Math.sin(awayAngle) * noMoveDistance - bh / 2;

    const inside = keepInside(targetX, targetY, bw, bh);
    targetX = inside.x; targetY = inside.y;

    // apply new pos
    noBtn.style.left = Math.round(targetX) + "px";
    noBtn.style.top  = Math.round(targetY) + "px";

    // --- CHEESY EFFECTS ---
    // 1) add wiggle class
    noBtn.classList.remove("no-cheesy");
    // force reflow to restart animation if repeated quickly
    // eslint-disable-next-line no-unused-expressions
    void noBtn.offsetWidth;
    noBtn.classList.add("no-cheesy");

    // remove class after animation length
    setTimeout(() => noBtn.classList.remove("no-cheesy"), 700);

    // 2) spawn emoji at the location where NO used to be (use center coords)
    spawnEmoji(c.x, c.y);

    // 3) play tiny boop sound
    playCheesySound();
  };

  // global mouse tracking
  document.addEventListener("mousemove", (ev) => {
    const mX = ev.clientX;
    const mY = ev.clientY;

    const noC = centerOf(noBtn);
    const distance = Math.hypot(mX - noC.x, mY - noC.y);

    if (distance < proximityThreshold) {
      moveNoAway(mX, mY);
      moveYesToward(mX, mY);
    }
  }, { passive: true });

  // YES click
  yesBtn.addEventListener("click", () => {
    result.innerHTML = "You chose YES ❤️ I love you so much. Happy Valentine's Day 💖";
  });

})();
