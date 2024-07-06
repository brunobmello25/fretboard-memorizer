import { createSignal, onCleanup } from "solid-js";

interface MetronomeProps {
  bpm: number;
  onTick: () => void;
}

function Metronome({ bpm, onTick }: MetronomeProps) {
  const [isRunning, setIsRunning] = createSignal(false);
  let intervalId: NodeJS.Timeout;

  const beep = () => {
    const context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "square"; // Use square wave for a clicky sound
    oscillator.frequency.setValueAtTime(1000, context.currentTime); // Frequency for the click sound
    gainNode.gain.setValueAtTime(1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + 0.05,
    ); // Short duration

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.05); // Play beep for 0.05 seconds
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
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

export default Metronome;
