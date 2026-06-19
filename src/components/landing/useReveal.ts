import { useEffect, useRef, useState } from "react";

/**
 * Adds the `.visible` class to a `.reveal` element once it scrolls into view
 * (one-shot). Mirrors the design's IntersectionObserver reveal pattern.
 * Respects prefers-reduced-motion by revealing immediately.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/** Convenience: returns the className string for a reveal element. */
export function revealClass(visible: boolean, extra = "") {
  return `reveal${visible ? " visible" : ""}${extra ? " " + extra : ""}`;
}
