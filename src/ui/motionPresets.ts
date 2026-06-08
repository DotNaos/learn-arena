export const panelEase = [0.22, 1, 0.36, 1] as const;

export const layoutTransition = {
  duration: 0.35,
  ease: panelEase,
};

export function getMotionTransition(
  reduceMotion: boolean | null,
  duration = 0.35,
) {
  if (reduceMotion) {
    return { duration: 0 };
  }

  return {
    duration,
    ease: panelEase,
    layout: layoutTransition,
  };
}
