import confetti from "canvas-confetti";

/** Tricolor confetti — saffron + white + green (Indian flag) */
export function celebrate(originX = 0.5, originY = 0.3) {
  confetti({
    particleCount: 150,
    spread: 80,
    startVelocity: 40,
    origin: { x: originX, y: originY },
    colors: ["#FF9933", "#FFFFFF", "#138808"],
  });
}

/** Full-screen tricolor celebration for VoteReady completion */
export function celebrateFull() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      spread: 100,
      startVelocity: 30,
      origin: { x: Math.random(), y: Math.random() * 0.4 },
      colors: ["#FF9933", "#FFFFFF", "#138808"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };

  frame();
}
