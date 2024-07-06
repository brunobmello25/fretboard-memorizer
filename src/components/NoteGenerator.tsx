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
    <div style={{ "text-align": "center", "margin-top": "20px" }}>
      <h1 style={{ "font-size": "5em", margin: "20px" }}>{note()}</h1>
      <Metronome onTick={generateNote} />
    </div>
  );
}

export default NoteGenerator;
