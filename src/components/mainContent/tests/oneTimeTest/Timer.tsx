import { useState, useEffect } from "react";

const Timer = (props: {
  endTest: (
    userAnswers: { [key: string]: any },
    mark: string,
    pointsForTasks: { [key: string]: number }
  ) => void;
  setTimeOut: (timeOut: boolean) => void;
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(3600);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      props.setTimeOut(true);
      End();
    }
  }, [secondsLeft]);

  const End = () => {
    console.log("Час закінчився!");
    // props.endTest(...) тут, якщо потрібно
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
