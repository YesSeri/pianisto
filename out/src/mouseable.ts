// @ts-nocheck
import { ElementSideEffectFn } from "./shared.ts";

export default function mouseable(node: SVGElement, cbStart: ElementSideEffectFn, cbEnd: ElementSideEffectFn) {
	let lastEl = null;

	function handleMouseDown(event) {
		console.log('mouse down')
		if (event.button !== 0) return;
		const el = event.target;
		if (!el || el.tagName !== 'path') return
		lastEl = el;
		cbStart(lastEl);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(event) {
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

	function handleMouseUp(event) {
		// const el = document.elementFromPoint(event.clientX, event.clientY);
		// if (!el || el.tagName !== "path") return
		cbEnd(lastEl);
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	}
	node.addEventListener('mousedown', handleMouseDown);
	return {
		destroy() {
			node.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		}
	};
}
