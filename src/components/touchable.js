export default function touchable(node) {
	let touches;

	function handleTouchDown(event) {
		touches = [...event.touches].map(el => el.target.id)
		node.dispatchEvent(new CustomEvent('touched', {
			detail: { touches }
		}));

		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleTouchRelease);
		window.addEventListener('touchcancel', handleTouchRelease);
	}

	function handleTouchMove(event) {
		// The filter function makes it so that if you touch outside the keyboard it doesn't get registered.
		const currentTouches = [...event.touches].map(touch => document.elementFromPoint(touch.clientX, touch.clientY)).filter(touch => touch?.tagName === 'path').map(el => el.id)
		let pressed = [];
		let released = [];
		for (const curTouch of currentTouches) {
			if (!touches.includes(curTouch)) {
				pressed.push(curTouch)
			}
		}
		for (const touch of touches) {
			if (!currentTouches.includes(touch)) {
				released.push(touch)
			}
		}
		touches = currentTouches;
		if (released.length || pressed.length) {
			node.dispatchEvent(new CustomEvent('moved', {
				detail: { released, pressed }
			}));
		}

	}

	function handleTouchRelease() {
		node.dispatchEvent(new CustomEvent('released', {
			detail: { released: touches }
		}));

		window.removeEventListener('touchmove', handleTouchMove);
		window.removeEventListener('touchend', handleTouchRelease);
		window.removeEventListener('touchcancel', handleTouchRelease);
	}

	node.addEventListener('touchstart', handleTouchDown);

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchDown);
		}
	};
}