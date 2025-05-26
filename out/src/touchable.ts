import { ElementSideEffectFn } from "./shared.ts";

export const touchable = (
  node: SVGElement,
  cbStart: ElementSideEffectFn,
  cbEnd: ElementSideEffectFn
) => {
  let activeTouches = new Set<Element>();

  function handleDown(event: TouchEvent) {
    event.preventDefault();
    for (const touch of event.targetTouches) {
      const el = touch.target;
      if (el instanceof Element && el?.id && !activeTouches.has(el)) {
        activeTouches.add(el);
        cbStart(el);
      }
    }
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);
    window.addEventListener("touchcancel", handleUp);
  }

  function handleMove(event: TouchEvent) {
    const current = new Set(
      [...event.touches]
        .map((t) => document.elementFromPoint(t.clientX, t.clientY))
        .filter((el) => el?.tagName === "path")
    );

    const filtered = new Set<Element>();
    for (const el of current) {
      if (el !== null) filtered.add(el);
    }

    for (const el of current) {
      if (el && !activeTouches.has(el)) cbStart(el);
    }
    for (const el of activeTouches) {
      if (el && !current.has(el)) cbEnd(el);
    }
    activeTouches = new Set([...current].filter((el): el is Element => !!el));
  }

  function handleUp(event: TouchEvent) {
    for (const touch of event.changedTouches) {
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (el && activeTouches.has(el)) {
        cbEnd(el);
        activeTouches.delete(el);
      }
    }
    if (event.touches.length === 0) {
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
      window.removeEventListener("touchcancel", handleUp);
      activeTouches.clear();
    }
  }

  node.addEventListener("touchstart", handleDown, { passive: false });
};
