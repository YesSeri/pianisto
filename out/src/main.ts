import { notesState } from "./shared.ts";
import setupSettings from "./settings.ts";
import setupPiano from "./piano.ts";

document.addEventListener('DOMContentLoaded', async () => {
    setupSettings(notesState);
    await setupPiano(notesState);
})