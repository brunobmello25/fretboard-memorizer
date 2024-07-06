import { createSignal } from "solid-js";
import Metronome from "./Metronome";

const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

function getRandomNote() {
  return notes[Math.floor(Math.random() * notes.length)];
}

function NoteGenerator() {
  const [note, setNote] = createSignal(getRandomNote());

  const generateNote = () => {
    setNote(getRandomNote());
  };

  return (
    <div>
      <h1>{note()}</h1>
      <Metronome bpm={60} onTick={generateNote} />
    </div>
  );
}

export default NoteGenerator;
