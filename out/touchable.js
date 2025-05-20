export default function touchable(node, cbStart, cbEnd) {
	let activeTouches = new Set();

	function handleTouchDown(event) {
		event.preventDefault();
		for (const touch of event.targetTouches) {
			// const id = touch.target?.id;
			const el = touch.target;
			if (el?.id && !activeTouches.has(el)) {
				activeTouches.add(el);
				cbStart(el);
			}
		}
		window.addEventListener('touchmove', handleTouchMove);
		window.addEventListener('touchend', handleTouchRelease);
		window.addEventListener('touchcancel', handleTouchRelease);
	}

	function handleTouchMove(event) {
		const current = new Set(
			[...event.touches]
				.map(t => document.elementFromPoint(t.clientX, t.clientY))
				.filter(el => el?.tagName === 'path')
		);

		// Pressed: now touched but not before
		for (const el of current) {
			if (!activeTouches.has(el)) cbStart(el);
		}
		// Released: was active, but not touched now
		for (const el of activeTouches) {
			if (!current.has(el)) cbEnd(el);
		}
		activeTouches = current;
	}

	function handleTouchRelease(event) {
		for (const touch of event.changedTouches) {
			const el = document.elementFromPoint(touch.clientX, touch.clientY);
			if (activeTouches.has(el)) {
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

// export default function touchable(node, cbStart, cbEnd) {
// 	let activeTouches = new Set();

// 	function handleTouchDown(event) {
// 		event.preventDefault();
// 		for (const touch of event.targetTouches) {
// 			const id = touch.target?.id;
// 			if (id && !activeTouches.has(id)) {
// 				activeTouches.add(id);
// 				cbStart(id);
// 			}
// 		}
// 		window.addEventListener('touchmove', handleTouchMove);
// 		window.addEventListener('touchend', handleTouchRelease);
// 		window.addEventListener('touchcancel', handleTouchRelease);
// 	}

// 	function handleTouchMove(event) {
// 		const current = new Set(
// 			[...event.touches]
// 				.map(t => document.elementFromPoint(t.clientX, t.clientY))
// 				.filter(el => el?.tagName === 'path')
// 				.map(el => el.id)
// 		);

// 		// Pressed: now touched but not before
// 		for (const id of current) {
// 			if (!activeTouches.has(id)) cbStart(id);
// 		}
// 		// Released: was active, but not touched now
// 		for (const id of activeTouches) {
// 			if (!current.has(id)) cbEnd(id);
// 		}
// 		activeTouches = current;
// 	}

// 	function handleTouchRelease(event) {
// 		for (const touch of event.changedTouches) {
// 			const el = document.elementFromPoint(touch.clientX, touch.clientY);
// 			const id = el?.id;
// 			if (id && activeTouches.has(id)) {
// 				cbEnd(id);
// 				activeTouches.delete(id);
// 			}
// 		}
// 		if (event.touches.length === 0) {
// 			window.removeEventListener('touchmove', handleTouchMove);
// 			window.removeEventListener('touchend', handleTouchRelease);
// 			window.removeEventListener('touchcancel', handleTouchRelease);
// 			activeTouches.clear();
// 		}
// 	}

// 	node.addEventListener('touchstart', handleTouchDown, { passive: false });

// 	return {
// 		destroy() {
// 			node.removeEventListener('touchstart', handleTouchDown);
// 			window.removeEventListener('touchmove', handleTouchMove);
// 			window.removeEventListener('touchend', handleTouchRelease);
// 			window.removeEventListener('touchcancel', handleTouchRelease);
// 			activeTouches.clear();
// 		}
// 	};
// }

// // touchable.js
// export default function touchable(node, cbStart, cbEnd) {
// 	let touches = [];

// 	function handleTouchDown(event) {
// 		event.preventDefault();
// 		const id = event.targetTouches[0]?.target?.id;
// 		if (id && !touches.includes(id)) {
// 			touches.push(id);
// 			cbStart(id);
// 		}
// 		window.addEventListener('touchmove', handleTouchMove);
// 		window.addEventListener('touchend', handleTouchRelease);
// 		window.addEventListener('touchcancel', handleTouchRelease);
// 	}

// 	function handleTouchMove(event) {
// 		const currentTouches = [...event.touches]
// 			.map(t => document.elementFromPoint(t.clientX, t.clientY))
// 			.filter(el => el?.tagName === 'path')
// 			.map(el => el.id);

// 		const pressed = currentTouches.filter(id => !touches.includes(id));
// 		const released = touches.filter(id => !currentTouches.includes(id));
// 		pressed.forEach(el => cbStart(el));
// 		released.forEach(el => cbEnd(el));
// 		touches = currentTouches;
// 	}

// 	function handleTouchRelease(event) {
// 		const t = event.changedTouches[0];
// 		const el = document.elementFromPoint(t.clientX, t.clientY);
// 		const id = el?.id;
// 		if (id) cbEnd(id)
// 		touches = touches.filter(_id => _id !== id);
// 		if (!event.touches.length) {
// 			window.removeEventListener('touchmove', handleTouchMove);
// 			window.removeEventListener('touchend', handleTouchRelease);
// 			window.removeEventListener('touchcancel', handleTouchRelease);
// 		}
// 	}

// 	node.addEventListener('touchstart', handleTouchDown, { passive: false });

// 	return {
// 		destroy() {
// 			node.removeEventListener('touchstart', handleTouchDown);
// 			window.removeEventListener('touchmove', handleTouchMove);
// 			window.removeEventListener('touchend', handleTouchRelease);
// 			window.removeEventListener('touchcancel', handleTouchRelease);
// 		}
// 	};
// }


// // This handles all the touch events. Is used inside the svg of the piano.
// // export default function touchable(node) {
// // 	let touches;

// // 	function handleTouchDown(event) {
// // 		const touch = event.targetTouches['0'].target.id
// // 		touches = [...new Set([...event.touches, event.targetTouches['0']].map(el => el.target.id))]
// // 		// Using event.preventDefault disables scrolling inside the piano.
// // 		event.preventDefault();
// // 		node.dispatchEvent(new CustomEvent('touched', {
// // 			detail: { touch }
// // 		}));

// // 		window.addEventListener('touchmove', handleTouchMove);
// // 		window.addEventListener('touchend', handleTouchRelease);
// // 		window.addEventListener('touchcancel', handleTouchRelease);
// // 	}

// // 	function handleTouchMove(event) {
// // 		// The filter function makes it so that if you touch outside the keyboard it doesn't get registered.
// // 		const currentTouches = [...event.touches].map(touch => document.elementFromPoint(touch.clientX, touch.clientY)).filter(touch => touch?.tagName === 'path').map(el => el.id)
// // 		let pressed = [];
// // 		let released = [];

// // 		for (const currentTouch of currentTouches) {
// // 			if (!touches.includes(currentTouch)) {
// // 				pressed.push(currentTouch)
// // 			}
// // 		}
// // 		for (const touch of touches) {
// // 			if (!currentTouches.includes(touch)) {
// // 				released.push(touch)
// // 			}
// // 		}

// // 		touches = currentTouches;
// // 		if (released.length || pressed.length) {
// // 			node.dispatchEvent(new CustomEvent('moved', {
// // 				detail: { released, pressed }
// // 			}));
// // 		}

// // 	}

// // 	function handleTouchRelease(e) {
// // 		const releasedTouch = e.changedTouches['0']
// // 		const path = document.elementFromPoint(releasedTouch.clientX, releasedTouch.clientY)
// // 		const releasedNote = path.id;
// // 		node.dispatchEvent(new CustomEvent('released', {
// // 			detail: { released: releasedNote }
// // 		}));

// // 		// window.removeEventListener('touchmove', handleTouchMove);
// // 		// window.removeEventListener('touchend', handleTouchRelease);
// // 		// window.removeEventListener('touchcancel', handleTouchRelease);
// // 	}

// // 	node.addEventListener('touchstart', handleTouchDown);

// // 	return {
// // 		destroy() {
// // 			node.removeEventListener('touchstart', handleTouchDown);
// // 		}
// // 	};
// // }

// // let activeTouches = []; // Array of currently pressed note ids

// // // --- Touchable (incorporated directly) ---
// // export default function touchable(node) {
// // 	let touches = [];

// // 	function handleTouchDown(event, cb) {
// // 		const target = event.targetTouches[0];
// // 		const touchId = target?.target.id;
// // 		if (touchId && !touches.includes(touchId)) {
// // 			touches.push(touchId);
// // 			playSound(touchId);
// // 			activeTouches.push(touchId);
// // 		}
// // 		event.preventDefault();
// // 		window.addEventListener('touchmove', handleTouchMove);
// // 		window.addEventListener('touchend', handleTouchRelease);
// // 		window.addEventListener('touchcancel', handleTouchRelease);
// // 	}

// // 	function handleTouchMove(event, cbPlay, cbStop) {
// // 		const currentTouches = [...event.touches]
// // 			.map(touch => document.elementFromPoint(touch.clientX, touch.clientY))
// // 			.filter(el => el?.tagName === 'path')
// // 			.map(el => el.id);

// // 		let newlyPressed = currentTouches.filter(t => !touches.includes(t));
// // 		let released = touches.filter(t => !currentTouches.includes(t));

// // 		for (const t of newlyPressed) {
// // 			playSound(t);
// // 			activeTouches.push(t);
// // 		}
// // 		for (const t of released) {
// // 			stopSound(t);
// // 			activeTouches = activeTouches.filter(id => id !== t);
// // 		}
// // 		touches = currentTouches;
// // 	}

// // 	function handleTouchRelease(event, cb) {
// // 		const released = event.changedTouches[0];
// // 		const el = document.elementFromPoint(released.clientX, released.clientY);
// // 		if (el && el.tagName === 'path') {
// // 			stopSound(el.id);
// // 			activeTouches = activeTouches.filter(id => id !== el.id);
// // 		}
// // 		touches = touches.filter(id => id !== (el && el.id));
// // 		// Optionally, remove listeners if no touches remain:
// // 		if (event.touches.length === 0) {
// // 			window.removeEventListener('touchmove', handleTouchMove);
// // 			window.removeEventListener('touchend', handleTouchRelease);
// // 			window.removeEventListener('touchcancel', handleTouchRelease);
// // 		}
// // 	}

// // 	node.addEventListener('touchstart', handleTouchDown, { passive: false });

// // 	return {
// // 		destroy() {
// // 			node.removeEventListener('touchstart', handleTouchDown);
// // 			window.removeEventListener('touchmove', handleTouchMove);
// // 			window.removeEventListener('touchend', handleTouchRelease);
// // 			window.removeEventListener('touchcancel', handleTouchRelease);
// // 		}
// // 	};
// // }