import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Computes SVG line coordinates between DOM nodes registered under string ids,
 * relative to a container ref. Recomputes on resize/layout change so the
 * "boxes + arrows" diagrams stay accurate across breakpoints.
 */
export function useConnectors(edges) {
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [lines, setLines] = useState([]);

  const register = useCallback(
    (id) => (el) => {
      if (el) nodeRefs.current[id] = el;
    },
    []
  );

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();

    const next = edges
      .map((edge) => {
        const fromEl = nodeRefs.current[edge.from];
        const toEl = nodeRefs.current[edge.to];
        if (!fromEl || !toEl) return null;
        const fr = fromEl.getBoundingClientRect();
        const tr = toEl.getBoundingClientRect();

        const fx = fr.left - cRect.left;
        const fy = fr.top - cRect.top;
        const tx = tr.left - cRect.left;
        const ty = tr.top - cRect.top;

        const fCenter = { x: fx + fr.width / 2, y: fy + fr.height / 2 };
        const tCenter = { x: tx + tr.width / 2, y: ty + tr.height / 2 };

        const dx = tCenter.x - fCenter.x;
        const dy = tCenter.y - fCenter.y;
        const vertical = Math.abs(dy) >= Math.abs(dx);

        let x1, y1, x2, y2;
        if (vertical) {
          x1 = fCenter.x;
          y1 = dy >= 0 ? fy + fr.height : fy;
          x2 = tCenter.x;
          y2 = dy >= 0 ? ty : ty + tr.height;
        } else {
          x1 = dx >= 0 ? fx + fr.width : fx;
          y1 = fCenter.y;
          x2 = dx >= 0 ? tx : tx + tr.width;
          y2 = tCenter.y;
        }

        return { ...edge, x1, y1, x2, y2 };
      })
      .filter(Boolean);

    setLines(next);
  }, [edges]);

  useEffect(() => {
    recompute();
    const ro = new ResizeObserver(() => recompute());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recompute);
    const t = setTimeout(recompute, 50);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
      clearTimeout(t);
    };
  }, [recompute]);

  return { containerRef, register, lines };
}
