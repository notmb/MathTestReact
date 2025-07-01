import { useState, useEffect } from "react";

const Timer = (props: {
  endTest: (
    userAnswers: { [key: string]: any },
    mark: string,
    pointsForTasks: { [key: string]: number }
  ) => void;
  setTimeOut: (timeOut: boolean) => void;
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(3600); // 1 година

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (secondsLeft > 0) {
      timerId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    if (secondsLeft === 0) {
      props.setTimeOut(true);
      End();
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [secondsLeft]);

  const End = () => {
    console.log("Час закінчився!");
    // Тут твоя логіка
  };

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
      <p className="text-xl text-red-500">
        Залишилося: {formatTime(secondsLeft)}
      </p>
    </div>
  );
};

export default Timer;
