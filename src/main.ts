import { checkboxState, notesState } from './shared.ts';
import setupSettings from './settings.ts';
import setupPiano from './piano.ts';

document.addEventListener('DOMContentLoaded', async () => {
  const [showNotes, showKey] = setupSettings(notesState, checkboxState);
  await setupPiano(notesState, checkboxState);
  checkboxState.init(showNotes, showKey);
  notesState.init();
});
