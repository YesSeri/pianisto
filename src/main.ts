import { checkboxState, notesState } from './shared.ts';
import setupSettings from './settings.ts';
import setupPiano from './piano.ts';

document.addEventListener('DOMContentLoaded', async () => {
  const { showNotes, showKeybinding, getSustainValue } = setupSettings(notesState, checkboxState);
  await setupPiano(notesState, checkboxState, getSustainValue);
  checkboxState.init(showNotes, showKeybinding);
  notesState.init();
});
