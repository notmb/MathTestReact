import { memo, useEffect, useState } from "react";

type TimerProps = {
  endAtMs: number;
};

const Timer = memo(function Timer(props: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.ceil((props.endAtMs - Date.now()) / 1000));
      setSecondsLeft(left);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [props.endAtMs]);

  if (secondsLeft === null) {
    return <div className="one-time-test-timer">Залишилось: ...</div>;
  }

  const minutesLeft = Math.floor(secondsLeft / 60);
  const secondsPart = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="one-time-test-timer">
      <div>Залишилось:</div>
      <div>
        {minutesLeft} хв : {secondsPart} сек
      </div>
    </div>
  );
});

export default Timer;
