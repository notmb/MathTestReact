import { useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";

const ClearTimer = (props: { startedAt: Timestamp; durationSec: number }) => {
  const endAtMs = useMemo(() => {
    return props.startedAt.toMillis() + props.durationSec * 1000;
  }, [props.startedAt, props.durationSec]);

  const calcLeftSec = () => {
    const leftMs = endAtMs - Date.now();
    return Math.max(0, Math.ceil(leftMs / 1000));
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(calcLeftSec());

  useEffect(() => {
    setSecondsLeft(calcLeftSec());

    const intervalId = window.setInterval(() => {
      const left = calcLeftSec();
      setSecondsLeft(left);

      // просто зупиняємо таймер на 0
      if (left <= 0) window.clearInterval(intervalId);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [endAtMs]);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return <div className="box_for_clear_tamer">{formatTime(secondsLeft)}</div>;
};

export default ClearTimer;
