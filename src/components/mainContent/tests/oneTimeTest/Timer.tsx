import { useState, useEffect } from "react";

const Timer = (props: { setTimeOut: (timeOut: boolean) => void }) => {
  const duration = 3600; // 1 година
  const [timeLeft, setTimeLeft] = useState(duration);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(duration - delta, 0);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        props.setTimeOut(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="timer">
      <p className="text-xl text-red-500">Залишилося: {formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;
