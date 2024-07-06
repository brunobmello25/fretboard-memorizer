import { createSignal, onCleanup } from "solid-js";

interface MetronomeProps {
  bpm: number;
  onTick: () => void;
}

function Metronome({ bpm, onTick }: MetronomeProps) {
  const [isRunning, setIsRunning] = createSignal(false);
  let intervalId: NodeJS.Timeout;

  const start = () => {
    if (!isRunning()) {
      setIsRunning(true);
      intervalId = setInterval(
        () => {
          onTick();
        },
        (60 / bpm) * 1000,
      );
    }
  };

  const stop = () => {
    if (isRunning()) {
      clearInterval(intervalId);
      setIsRunning(false);
    }
  };

  onCleanup(() => clearInterval(intervalId));

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

export default Metronome;
