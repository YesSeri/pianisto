// This handles all the touch events. Is used inside the svg of the piano.
export default function touchable(node) {
	let touches;

	function handleTouchDown(event) {
		const touch = event.targetTouches['0'].target.id
		touches = [...new Set([...event.touches, event.targetTouches['0']].map(el => el.target.id))]
		// Using event.preventDefault disables scrolling inside the piano.
		event.preventDefault();
		node.dispatchEvent(new CustomEvent('touched', {
			detail: { touch }
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

		for (const currentTouch of currentTouches) {
			if (!touches.includes(currentTouch)) {
				pressed.push(currentTouch)
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

	function handleTouchRelease(e) {
		const releasedTouch = e.changedTouches['0']
		const path = document.elementFromPoint(releasedTouch.clientX, releasedTouch.clientY)
		const releasedNote = path.id;
		node.dispatchEvent(new CustomEvent('released', {
			detail: { released: releasedNote }
		}));

		// window.removeEventListener('touchmove', handleTouchMove);
		// window.removeEventListener('touchend', handleTouchRelease);
		// window.removeEventListener('touchcancel', handleTouchRelease);
	}

	node.addEventListener('touchstart', handleTouchDown);

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchDown);
		}
	};
}