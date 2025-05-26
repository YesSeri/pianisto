import { ElementSideEffectFn} from "./shared.ts";

export const mouseable = (node: SVGElement, cbStart: ElementSideEffectFn, cbEnd: ElementSideEffectFn) => {
	let lastEl: Element | null = null;

	function handleDown(event: MouseEvent) {
		if (event.button !== 0) return;
		const el = event.target;
		if (!(el instanceof Element) || el.tagName !== 'path') return
		lastEl = el;
		cbStart(lastEl);
		window.addEventListener('mousemove', handleMove);
		window.addEventListener('mouseup', handleUp);
	}

	function handleMove(event: MouseEvent) {
		const el = document.elementFromPoint(event.clientX, event.clientY);

		if (el && el.tagName === 'path') {
			if (el !== lastEl) {
				if (lastEl) cbEnd(lastEl);
				cbStart(el);
				lastEl = el;
			}
			return;
		}
		if (lastEl) {
			cbEnd(lastEl);
			lastEl = null;
		}
	}

	function handleUp(_event: MouseEvent) {
		if (!lastEl) return;
		cbEnd(lastEl);
		window.removeEventListener('mousemove', handleMove);
		window.removeEventListener('mouseup', handleUp);
	}
	node.addEventListener('mousedown', handleDown);
}
