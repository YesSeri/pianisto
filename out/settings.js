import state from './shared.js';

let lowestNote = state.notes[0];
let highestNote = state.notes[state.notes.length - 1];

const showNotesCheckbox = document.getElementById("showNotes");
const showKeybindingsCheckbox = document.getElementById("showKeybindings");
const container = document.getElementById("settings-container");
const toggleBtn = document.getElementById("toggle-settings");

let showNotes = JSON.parse(localStorage.getItem("showNotes") || "false");
let showKeybindings = JSON.parse(localStorage.getItem("showKeybindings") || "false");

const lowestSelect = document.getElementById("lowestNote");
const highestSelect = document.getElementById("highestNote");

const allNotes = state.allNotes;

function updateDisplayedNotes() {
	const lowIndex = allNotes.indexOf(lowestNote);
	const highIndex = allNotes.indexOf(highestNote);
	const slice = allNotes.slice(lowIndex, highIndex + 1);
	state.notes = slice;
}

function refreshOptions() {
	populateSelect(lowestSelect, allNotes.slice(0, allNotes.indexOf(highestNote)));
	populateSelect(highestSelect, allNotes.slice(allNotes.indexOf(lowestNote) + 1));
	lowestSelect.value = lowestNote;
	highestSelect.value = highestNote;
}


function populateSelect(select, options) {
	select.innerHTML = "";
	options.forEach(note => {
		const opt = document.createElement("option");
		opt.value = note;
		opt.textContent = note;
		select.appendChild(opt);
	});
}

lowestSelect.addEventListener("change", () => {
	lowestNote = lowestSelect.value;
	localStorage.setItem("lowestNote", lowestNote);
	refreshOptions();
	updateDisplayedNotes();
});
highestSelect.addEventListener("change", () => {
	highestNote = highestSelect.value;
	localStorage.setItem("highestNote", highestNote);
	refreshOptions();
	updateDisplayedNotes();
});

showNotesCheckbox.addEventListener("change", () => {
	showNotes = showNotesCheckbox.checked;
	localStorage.setItem("showNotes", showNotes);
});
showKeybindingsCheckbox.addEventListener("change", () => {
	showKeybindings = showKeybindingsCheckbox.checked;
	localStorage.setItem("showKeybindings", showKeybindings);
});

toggleBtn.addEventListener("click", () => {
	container.classList.toggle("hide");
});

showNotesCheckbox.checked = showNotes;
showKeybindingsCheckbox.checked = showKeybindings;

refreshOptions();
updateDisplayedNotes();
