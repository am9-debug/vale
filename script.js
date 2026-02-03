const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const result = document.getElementById("result");

noBtn.style.position = "absolute";
yesBtn.style.position = "absolute";

noBtn.style.transition = "0.25s ease";
yesBtn.style.transition = "0.35s ease";

// Initial positions
noBtn.style.left = "55%";
noBtn.style.top = "55%";

yesBtn.style.left = "40%";
yesBtn.style.top = "55%";

// Track mouse movement
document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const noRect = noBtn.getBoundingClientRect();
  const noCenterX = noRect.left + noRect.width / 2;
  const noCenterY = noRect.top + noRect.height / 2;

  const distance = Math.hypot(mouseX - noCenterX, mouseY - noCenterY);

  // If cursor gets close to NO
  if (distance < 120) {
    // Move NO (hide & seek)
    let newX = noBtn.offsetLeft + (Math.random() > 0.5 ? 120 : -120);
    let newY = noBtn.offsetTop + (Math.random() > 0.5 ? 120 : -120);

    // Keep NO visible
    newX = Math.max(20, Math.min(window.innerWidth - 120, newX));
    newY = Math.max(20, Math.min(window.innerHeight - 60, newY));

    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";

    // Bring YE
