import { ElementSideEffectFn } from "./shared.ts";

export default function touchable(node: SVGElement, cbStart: ElementSideEffectFn, cbEnd: ElementSideEffectFn) {
	let activeTouches = new Set<Element>();

	function handleTouchDown(event: TouchEvent) {
		event.preventDefault();
		for (const touch of event.targetTouches) {
			const el = touch.target;
			if (el instanceof Element && el?.id && !activeTouches.has(el)) {
				activeTouches.add(el);
				cbStart(el);
			}
		}
		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleTouchRelease);
		window.addEventListener('touchcancel', handleTouchRelease);
	}

	function handleTouchMove(event: TouchEvent) {
		const current = new Set(
			[...event.touches]
				.map(t => document.elementFromPoint(t.clientX, t.clientY))
				.filter(el => el?.tagName === 'path')
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

	function handleTouchRelease(event: TouchEvent) {
		for (const touch of event.changedTouches) {
			const el = document.elementFromPoint(touch.clientX, touch.clientY);
			if (el && activeTouches.has(el)) {
				cbEnd(el);
				activeTouches.delete(el);
			}
		}
		if (event.touches.length === 0) {
			window.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('touchend', handleTouchRelease);
			window.removeEventListener('touchcancel', handleTouchRelease);
			activeTouches.clear();
		}
	}

	node.addEventListener('touchstart', handleTouchDown, { passive: false });

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchDown);
			window.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('touchend', handleTouchRelease);
			window.removeEventListener('touchcancel', handleTouchRelease);
			activeTouches.clear();
		}
	};
}
