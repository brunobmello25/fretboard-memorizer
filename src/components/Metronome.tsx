import { createSignal, onCleanup } from "solid-js";

interface MetronomeProps {
  onTick: () => void;
}

function Metronome({ onTick }: MetronomeProps) {
  const [bpm, setBpm] = createSignal(60);
  const [isRunning, setIsRunning] = createSignal(false);
  let intervalId: NodeJS.Timeout | null = null;
  let audioContext: AudioContext | null = null;

  const beep = () => {
    if (audioContext) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      gainNode.gain.setValueAtTime(1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.05,
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);
    }
  };

  const start = () => {
    if (!isRunning()) {
      // Create or resume the AudioContext
      if (!audioContext) {
        audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      } else if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      setIsRunning(true);
      intervalId = setInterval(
        () => {
          beep();
          onTick();
        },
        (60 / bpm()) * 1000,
      );
    }
  };

  const stop = () => {
    if (isRunning() && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
      setIsRunning(false);
    }
  };

  onCleanup(() => {
    if (intervalId !== null) clearInterval(intervalId);
    if (audioContext) audioContext.close();
  });

  return (
    <div>
      <input
        type="number"
        value={bpm()}
        onInput={(e) => {
          const newBpm = parseInt(e.currentTarget.value || "0");
          setBpm(newBpm);
          stop();
        }}
        style={{ "font-size": "1.5em", margin: "10px", padding: "5px" }}
      />
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

export default Metronome;
