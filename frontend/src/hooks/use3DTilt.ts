import { useRef, useCallback } from 'react';

/**
 * use3DTilt — adds a smooth 3D perspective-tilt on mouse hover.
 * Returns a ref to attach to the element and event handlers.
 *
 * How it works:
 *   1. On mousemove, calculate the cursor position relative to the card centre.
 *   2. Map that offset to a rotateX/rotateY value within ±maxTilt degrees.
 *   3. Apply via requestAnimationFrame for smooth 60fps updates.
 *   4. On mouseleave, spring back to flat using CSS transition.
 */
export function use3DTilt(maxTilt = 8) {
  const ref = useRef<HTMLElement>(null);
  const rafId = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        // Normalise cursor to [-1, 1] relative to card centre
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        const rotateX = -y * maxTilt;   // tilt up/down
        const rotateY =  x * maxTilt;   // tilt left/right

        el.style.transform = `
          perspective(800px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale3d(1.03, 1.03, 1.03)
        `;
        el.style.transition = 'transform 0.05s ease-out';
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    el.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave } as const;
}
