import { CheckboxState, NotesState } from './shared.ts';

export default function settings(state: NotesState, checkboxState: CheckboxState) {
  const allNotes = state.allNotes;

  const showNotesCheckbox = document.getElementById('showNotes') as HTMLInputElement;
  const showKeybindingsCheckbox = document.getElementById('showKeybindings') as HTMLInputElement;
  const lowestSelect = document.getElementById('lowestNote') as HTMLSelectElement;
  const highestSelect = document.getElementById('highestNote') as HTMLSelectElement;
  const showFullscreenButton = document.getElementById('showFullscreen') as HTMLSelectElement;
  const sustainSlider = document.getElementById('setSustain') as HTMLSelectElement;

  function populateSelect(select: HTMLSelectElement, options: string[]) {
    select.innerHTML = '';
    options.forEach((note) => {
      const opt = document.createElement('option');
      opt.value = note;
      opt.textContent = note;
      select.appendChild(opt);
    });
  }

  function refreshOptions() {
    const lowestNote = state.notes[0];
    const highestNote = state.notes[state.notes.length - 1];
    populateSelect(lowestSelect, allNotes.slice(0, allNotes.indexOf(highestNote)));
    populateSelect(highestSelect, allNotes.slice(allNotes.indexOf(lowestNote) + 1));
    lowestSelect.value = lowestNote;
    highestSelect.value = highestNote;
  }

  function updateDisplayedNotes() {
    const lowestNote = state.notes[0];
    const highestNote = state.notes[state.notes.length - 1];

    const lowIndex = allNotes.indexOf(lowestNote);
    const highIndex = allNotes.indexOf(highestNote);
    const slice = allNotes.slice(lowIndex, highIndex + 1);
    state.notes = slice;
  }

  lowestSelect.addEventListener('change', () => {
    const lowestNote = lowestSelect.value;
    state.lowestNote = lowestNote;
    refreshOptions();
    updateDisplayedNotes();
  });

  highestSelect.addEventListener('change', () => {
    const highestNote = highestSelect.value;
    state.highestNote = highestNote;
    refreshOptions();
    updateDisplayedNotes();
  });

  sustainSlider.addEventListener('change', (evt) => {
    console.log({ evt });
    console.log(sustainSlider.value);
    // const highestNote = highestSelect.value;
    // state.highestNote = highestNote;
    // refreshOptions();
    // updateDisplayedNotes();
  });

  showNotesCheckbox.addEventListener('change', function () {
    checkboxState.showNoteValue = this.checked;
  });
  showKeybindingsCheckbox.addEventListener('change', function () {
    checkboxState.showKeybindings = this.checked;
  });
  showFullscreenButton.addEventListener('click', () => {
    const canvas = document.getElementById('piano');
    canvas?.requestFullscreen();
  });

  refreshOptions();
  updateDisplayedNotes();
  return [showNotesCheckbox.checked, showKeybindingsCheckbox.checked];
}
