const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const result = document.getElementById("result");

// Prepare buttons
noBtn.style.position = "absolute";
yesBtn.style.position = "absolute";
noBtn.style.transition = "0.25s ease";
yesBtn.style.transition = "0.35s ease";

// Initial positions
noBtn.style.left = "55%";
noBtn.style.top = "55%";
yesBtn.style.left = "40%";
yesBtn.style.top = "55%";

// Hide & Seek logic for NO
noBtn.addEventListener("mousemove", (e) => {
  const moveDistance = 120;

  let newX = noBtn.offsetLeft + (Math.random() > 0.5 ? moveDistance : -moveDistance);
  let newY = noBtn.offsetTop + (Math.random() > 0.5 ? moveDistance : -moveDistance);

  // Keep NO inside screen
  newX = Math.max(20, Math.min(window.innerWidth - 120, newX));
  newY = Math.max(20, Math.min(window.innerHeight - 60, newY));

  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";
});

// YES comes closer when NO tries to escape
noBtn.addEventListener("mouseenter", (e) => {
  const offsetX = 80;
  const offsetY = 40;

  yesBtn.style.left = e.clientX - offsetX + "px";
  yesBtn.style.top = e.clientY - offsetY + "px";
});

// YES click reaction
yesBtn.addEventListener("click", () => {
  result.innerHTML = "You found the right answer ❤️ Happy Valentine’s Day 💖🌹";
});
