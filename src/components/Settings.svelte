<script>
  let notes = [
    "G3",
    "A3",
    "B3",
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
    "D5",
    "E5",
    "F5",
    "G5",
    "A5",
    "B5",
    "C6",
    "D6",
    "E6",
    "F6",
    "G6",
    "A6",
  ];
  let lowestNote = localStorage.getItem("lowestNote");
  let highestNote = localStorage.getItem("highestNote");
  $: {
    if (!(notes.includes(lowestNote) && notes.includes(highestNote))) {
      lowestNote = "C4";
      highestNote = "C5";
    }
    localStorage.setItem("lowestNote", lowestNote);
    localStorage.setItem("highestNote", highestNote);
  }
  export let showKeybindings = false;
  export let showNotes = false;
  export let displayedNotes = notes.slice(
    notes.indexOf(lowestNote),
    notes.indexOf(highestNote) + 1,
  );

  $: displayedNotes = notes.slice(
    notes.indexOf(lowestNote),
    notes.indexOf(highestNote) + 1,
  );
  export let showSettings;
</script>

<div class:hide={!showSettings} id="settings-container">
  <div class="setting">
    <label for="lowestNote">Select lowest note:</label>
    <select bind:value={lowestNote} name="lowestNote" id="lowestNote">
      {#each notes.slice(0, notes.indexOf(highestNote)) as note, key}
        <option selected={note === lowestNote} {key} value={note}
          >{note}
        </option>
      {/each}
    </select>
  </div>
  <div class="setting">
    <label for="highestNote">Select highest note:</label>
    <select bind:value={highestNote} name="highestNote" id="highestNote">
      {#each notes.slice(notes.indexOf(lowestNote) + 1) as note, key}
        <option selected={note === highestNote} {key} value={note}
          >{note}
        </option>
      {/each}
    </select>
  </div>
  <div class="setting">
    <label for="showNotes">Show Note Values:</label>
    <div>
      <input
        bind:checked={showNotes}
        type="checkbox"
        id="showNotes"
        name="showNotes"
      />
    </div>
  </div>
  <div class="setting">
    <label for="showKeybindings">Show Keybindings:</label>
    <div>
      <input
        bind:checked={showKeybindings}
        type="checkbox"
        id="showKeybindings"
        name="showKeybindings"
      />
    </div>
  </div>
</div>

<style>
  #settings-container {
    border-radius: 25px;
    margin: 10px 0 5px 0;
    background-color: #ccc;
    display: inline-block;
    padding: 10px;
    box-shadow: 0 0 8px 0 #000;
  }
  .setting {
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    margin: 4px;
    padding: 4px;
  }
  select,
  input {
    padding: 0;
    margin: 0;
  }

  label {
    margin-right: 5px;
  }
  @media screen and (max-width: 600px) {
    label {
      margin-right: 0;
    }
    .setting {
      display: block;
    }
    select {
      min-width: 80px;
    }
  }
  #settings-container.hide {
    display: none;
  }
</style>
