import confetti from "canvas-confetti";

export function celebrate(originX = 0.78, originY = 0.24) {
  confetti({
    particleCount: 120,
    spread: 70,
    startVelocity: 35,
    origin: { x: originX, y: originY },
    colors: ["#1A56DB", "#057A55", "#F59E0B", "#F8FAFC"],
  });
}
