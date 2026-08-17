export function playOutcomeSound(src: string, fallback: () => void) {
  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => fallback());
  } catch {
    fallback();
  }
}
