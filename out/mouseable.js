export default function mouseable(node, cbStart, cbEnd) {
	let lastEl = null;

	function handleMouseDown(event) {
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
