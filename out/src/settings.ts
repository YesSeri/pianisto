import { NotesState } from "./shared.ts";

export default function settings(state: NotesState) {
  const allNotes = state.allNotes;

  let lowestNote = localStorage.getItem("lowestNote") || state.notes[0];
  let highestNote = localStorage.getItem("highestNote") || state.notes[state.notes.length - 1];

  const showNotesCheckbox = document.getElementById("showNotes") as HTMLInputElement;
  const showKeybindingsCheckbox = document.getElementById("showKeybindings") as HTMLInputElement;
  const container = document.getElementById("settings-container") as HTMLElement;
  const toggleBtn = document.getElementById("toggle-settings") as HTMLButtonElement;
  const lowestSelect = document.getElementById("lowestNote") as HTMLSelectElement;
  const highestSelect = document.getElementById("highestNote") as HTMLSelectElement;

  function bindCheckboxToStorage(checkbox: HTMLInputElement, key: string, defaultVal: boolean) {
    checkbox.checked = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultVal));
    checkbox.addEventListener("change", () => {
      localStorage.setItem(key, checkbox.checked ? "true" : "false");
    });
  }

  function populateSelect(select: HTMLSelectElement, options: string[]) {
    select.innerHTML = "";
    options.forEach(note => {
      const opt = document.createElement("option");
      opt.value = note;
      opt.textContent = note;
      select.appendChild(opt);
    });
  }

  function refreshOptions() {
    populateSelect(lowestSelect, allNotes.slice(0, allNotes.indexOf(highestNote)));
    populateSelect(highestSelect, allNotes.slice(allNotes.indexOf(lowestNote) + 1));
    lowestSelect.value = lowestNote;
    highestSelect.value = highestNote;
  }

  function updateDisplayedNotes() {
    const lowIndex = allNotes.indexOf(lowestNote);
    const highIndex = allNotes.indexOf(highestNote);
    const slice = allNotes.slice(lowIndex, highIndex + 1);
    state.notes = slice;
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

  bindCheckboxToStorage(showNotesCheckbox, "showNotes", false);
  bindCheckboxToStorage(showKeybindingsCheckbox, "showKeybindings", false);

  toggleBtn.addEventListener("click", () => {
    container.classList.toggle("hide");
  });

  refreshOptions();
  updateDisplayedNotes();

}
