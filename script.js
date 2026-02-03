// Robust hide-and-seek logic
(function () {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const result = document.getElementById("result");

  if (!noBtn || !yesBtn) {
    console.error("Buttons not found. Make sure #yes and #no exist.");
    return;
  }

  // initial fixed positions (center-ish)
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

  // Movement settings
  const proximityThreshold = 140;      // when cursor is this close to NO, trigger dodge
  const noMoveDistance = 110;          // how far NO hops (px)
  const minGap = 90;                   // minimum center-to-center gap between buttons
  let lastNoMove = 0;
  const noMoveCooldown = 180;          // ms between NO moves to avoid frantic jumping

  // helper to clamp values
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  // Return center coordinates of an element
  const centerOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  };

  // Keep button fully inside viewport (with margins)
  const keepInside = (x, y, bw, bh) => {
    const margin = 12;
    const maxX = vw() - bw - margin;
    const maxY = vh() - bh - margin;
    const nx = clamp(x, margin, maxX);
    const ny = clamp(y, margin, maxY);
    return { x: nx, y: ny };
  };

  // Bring YES toward cursor but avoid overlapping NO
  const moveYesToward = (mouseX, mouseY) => {
    const bw = yesBtn.offsetWidth, bh = yesBtn.offsetHeight;
    // offset so YES doesn't sit right under the pointer
    const offsetX = 70;
    const offsetY = 35;

    let targetX = mouseX - offsetX;
    let targetY = mouseY - offsetY;

    // keep YES inside viewport
    const inside = keepInside(targetX, targetY, bw, bh);
    targetX = inside.x; targetY = inside.y;

    // ensure it's not too close to NO; if too close, push YES to opposite side of cursor
    const noC = centerOf(noBtn);
    const yesCenterX = targetX + bw / 2;
    const yesCenterY = targetY + bh / 2;
    const dist = Math.hypot(yesCenterX - noC.x, yesCenterY - noC.y);

    if (dist < minGap) {
      // move YES to other side of cursor
      const dx = mouseX - noC.x;
      const dy = mouseY - noC.y;
      const signX = dx >= 0 ? 1 : -1;
      const signY = dy >= 0 ? 1 : -1;
      // try to place YES at mouse +/- offsets
      let altX = mouseX + signX * (offsetX + 40);
      let altY = mouseY + signY * (offsetY + 20);
      const altInside = keepInside(altX, altY, bw, bh);
      targetX = altInside.x;
      targetY = altInside.y;
    }

    yesBtn.style.left = Math.round(targetX) + "px";
    yesBtn.style.top  = Math.round(targetY) + "px";
  };

  // Move NO in short hops (stays visible)
  const moveNoAway = (mouseX, mouseY) => {
    const now = Date.now();
    if (now - lastNoMove < noMoveCooldown) return; // throttle movement
    lastNoMove = now;

    const bw = noBtn.offsetWidth, bh = noBtn.offsetHeight;
    const c = centerOf(noBtn);

    // choose a random direction away from cursor (prefer opposite side)
    const angleToCursor = Math.atan2(mouseY - c.y, mouseX - c.x);
    // pick angle roughly opposite (add some randomness)
    const awayAngle = angleToCursor + Math.PI + (Math.random() - 0.5) * (Math.PI / 3);

    let targetX = c.x + Math.cos(awayAngle) * noMoveDistance - bw / 2;
    let targetY = c.y + Math.sin(awayAngle) * noMoveDistance - bh / 2;

    const inside = keepInside(targetX, targetY, bw, bh);
    targetX = inside.x; targetY = inside.y;

    noBtn.style.left = Math.round(targetX) + "px";
    noBtn.style.top  = Math.round(targetY) + "px";
  };

  // global mouse tracking
  document.addEventListener("mousemove", (ev) => {
    const mX = ev.clientX;
    const mY = ev.clientY;

    const noC = centerOf(noBtn);
    const distance = Math.hypot(mX - noC.x, mY - noC.y);

    if (distance < proximityThreshold) {
      // trigger both behaviors
      moveNoAway(mX, mY);
      moveYesToward(mX, mY);
    } else {
      // small passive behavior: gently move YES a bit toward center line
      // (optional) keep YES near center when mouse is far
      // Not required; comment out if undesired.
    }
  });

  // YES click
  yesBtn.addEventListener("click", () => {
    result.innerHTML = "You chose YES ❤️ I love you so much. Happy Valentine's Day 💖";
    // optional: add confetti or extra effect here
  });

})();
