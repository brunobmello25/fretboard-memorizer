import { createSignal, onCleanup } from "solid-js";

interface MetronomeProps {
  bpm: number;
  onTick: () => void;
  onBpmChange: (bpm: number) => void;
}

function Metronome({ bpm, onTick, onBpmChange }: MetronomeProps) {
  const [isRunning, setIsRunning] = createSignal(false);
  let intervalId: NodeJS.Timeout;

  const beep = () => {
    const context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(1000, context.currentTime);
    gainNode.gain.setValueAtTime(1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + 0.05,
    );

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.05);
  };

  const start = () => {
    if (!isRunning()) {
      setIsRunning(true);
      intervalId = setInterval(
        () => {
          beep();
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
      <input
        type="number"
        value={bpm}
        onInput={(e) => onBpmChange(parseInt(e.currentTarget.value))}
        style={{ "font-size": "1.5em", margin: "10px", padding: "5px" }}
      />
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

export default Metronome;
