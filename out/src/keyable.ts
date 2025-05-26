import { ElementSideEffectFn, KeyCode, translations } from "./shared.ts";

export const keyable = (
  _node: any,
  cbStart: ElementSideEffectFn,
  cbEnd: ElementSideEffectFn
) => {
  const pressed = new Set<KeyCode>();

  function handleDown(evt: KeyboardEvent) {
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "SELECT" ||
        active.tagName === "TEXTAREA")
    ) {
      (active as HTMLElement).blur();
    }

    const isRefreshPressed = evt.code === "KeyR" && evt.ctrlKey;
    const isDevToolsPressed =
      evt.code === "KeyC" && evt.ctrlKey && evt.shiftKey;
    if (isRefreshPressed || isDevToolsPressed) {
      return;
    }
    if (!isKeyCode(evt.code) || pressed.has(evt.code)) return;
    evt.preventDefault();
    pressed.add(evt.code);
    const translation = translations[evt.code];
    const el: Element | null = document.getElementById(translation.note);
    if (!el) return;
    cbStart(el);
  }

  function handleUp(evt: KeyboardEvent) {
    evt.preventDefault();
    if (!isKeyCode(evt.code)) return;
    pressed.delete(evt.code);
    const translation = translations[evt.code];
    const el: Element | null = document.getElementById(translation.note);
    if (!el) return;
    cbEnd(el);
  }
  window.addEventListener("keydown", handleDown, { capture: true });
  window.addEventListener("keyup", handleUp, { capture: true });
};

function isKeyCode(code: string): code is KeyCode {
  return code in translations;
}
