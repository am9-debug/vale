const noBtn = document.getElementById("no");
const yesBtn = document.getElementById("yes");
const result = document.getElementById("result");

// Make YES smoothly movable
yesBtn.style.position = "absolute";
yesBtn.style.transition = "0.4s ease";

// NO button escapes
noBtn.addEventListener("mouseover", (e) => {
  // Move NO far away
  noBtn.style.position = "absolute";
  noBtn.style.left = Math.random() * 85 + "%";
  noBtn.style.top = Math.random() * 85 + "%";

  // Bring YES closer to cursor (but not exact spot)
  const offsetX = 60;
  const offsetY = 40;

  yesBtn.style.left = e.clientX - offsetX + "px";
  yesBtn.style.top = e.clientY - offsetY + "px";
});

// YES click reaction
yesBtn.addEventListener("click", () => {
  result.innerHTML = "YAY ❤️ You chose YES! Happy Valentine’s Day 💖🌹";
});
