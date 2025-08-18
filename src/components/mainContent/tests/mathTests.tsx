import { Tasks, Task1, Task2, Task3 } from "../types";
import { useImmer } from "use-immer";
import { useEffect, useState } from "react";

import Timer from "./oneTimeTest/timer";
import TaskChoice from "./taskChoice";
import TaskComparison from "./taskComparison";
import TaskOpenAnswer from "./taskOpenAnswer";
interface CorrectComparison {
  [key: string]: string;
}

const MathTest = (props: {
  tasks?: Tasks;
  selectedVariant: string;
  endTest?: (
    userAnswers: { [key: string]: any },
    mark: string,
    pointsForTasks: { [key: string]: number }
  ) => void;
}) => {
  const [userAnswers, updateUserAnswers] = useImmer<{ [key: string]: any }>({});

  const [timeOut, setTimeOut] = useState<boolean>(false);

  const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
  const isTask2 = (task: any): task is Task2 =>
    task.typeOfTask === "comparison";
  const isTask3 = (task: any): task is Task3 =>
    task.typeOfTask === "openAnswer";

  //Перевірка
  const CheckComparison = (
    correctAnswer: CorrectComparison,
    userAnswers: CorrectComparison
  ) => {
    let mark = 0;
    Object.entries(userAnswers).forEach(([key, item]) => {
      if (item === correctAnswer[key]) {
        mark = mark + 1;
      }
    });
    return mark;
  };

  const testCheck = () => {
    const comparison: { [key: string]: number } = {};
    let maxMark = 0;

    props.tasks &&
      Object.entries(props.tasks).forEach(([key, item]) => {
        if (isTask1(item)) {
          maxMark = maxMark + 1;
          if (item.correctAnswer === userAnswers[key]) {
            comparison[key] = 1;
          } else {
            comparison[key] = 0;
          }
        }
        if (isTask2(item)) {
          maxMark = maxMark + 3;

          comparison[key] = CheckComparison(
            item.correctComparison,
            userAnswers[key]
          );
        }
        if (isTask3(item)) {
          maxMark += 2;
          if (item.correctAnswer === userAnswers[key]) {
            comparison[key] = 2;
            console.log(comparison);
          } else {
            comparison[key] = 0;
          }
        }
      });

    let sum = 0;
    Object.values(comparison).map((value) => {
      sum = sum + value; // Додаємо значення
    });

    // Бал у НМТ
    function getNmtMark(sum: number): number | string {
      const map: { [key: number]: number } = {
        5: 100,
        6: 108,
        7: 115,
        8: 123,
        9: 131,
        10: 134,
        11: 137,
        12: 140,
        13: 143,
        14: 145,
        15: 147,
        16: 148,
        17: 149,
        18: 150,
        19: 151,
        20: 152,
        21: 155,
        22: 159,
        23: 163,
        24: 167,
        25: 170,
        26: 173,
        27: 176,
        28: 180,
        29: 184,
        30: 189,
        31: 194,
        32: 200,
      };

      return map[sum] ?? "Тест не пройдено";
    }

    const nmtMark = getNmtMark(sum);

    return { sum, nmtMark, comparison };
  };
  //ПЕРЕВІРКА

  const checkAndEnd = () => {
    const result = testCheck();

    props.endTest &&
      props.endTest(
        userAnswers,
        `${result.sum}/${result.nmtMark}`,
        result.comparison
      );
    alert(
      "Твій бал за тест: " +
        result.sum +
        "\nТвій бал у форматі НМТ: " +
        result.nmtMark
    );
  };
  useEffect(() => {
    console.log(timeOut);
    if (timeOut) {
      checkAndEnd();
    }
  }, [timeOut]);

  return (
    <div>
      {props.endTest && <Timer setTimeOut={setTimeOut}></Timer>}
      <div className="conteiner_for_test">
        <div className="tests">
          {props.tasks &&
            Object.entries(props.tasks).map(([key, task]) => (
              <div key={key}>
                {+key === 16 && (
                  <div className="condition">
                    <h2 className=" text-2xl">
                      У завданнях 16-18 до кожного з трьох рядків інформації,
                      позначених цифрами доберіть один правильний на Вашу думĸу
                      варіант позначений буквою.
                    </h2>
                  </div>
                )}
                {+key === 19 && (
                  <div className="condition">
                    <h2 className="">
                      Розв'яжіть завдання 19-22. Одержані числові відповіді
                      запишіть у спеціально відведеному місці. Відповідь
                      записуйте лише десятĸовим дробом.
                    </h2>
                  </div>
                )}
                {isTask1(task) && (
                  <TaskChoice
                    selectedVariant={props.selectedVariant}
                    task={task.task}
                    answers={task.answers}
                    number={key}
                    updateUserAnswer={(idTask: string, userAnswers: any) =>
                      updateUserAnswers((draft) => {
                        draft[idTask] = userAnswers;
                      })
                    }
                  />
                )}
                {isTask2(task) && (
                  <TaskComparison
                    selectedVariant={props.selectedVariant}
                    task={task.task}
                    comparisonTable={task.comparisonTable}
                    number={key}
                    updateUserAnswer={(userAnswers: any) => {
                      updateUserAnswers((draft) => {
                        draft[key] = userAnswers;
                      });
                    }}
                  />
                )}
                {isTask3(task) && (
                  <TaskOpenAnswer
                    selectedVariant={props.selectedVariant}
                    task={task.task}
                    number={key}
                    updateUserAnswer={(idTask: string, userAnswers: any) =>
                      updateUserAnswers((draft) => {
                        draft[idTask] = userAnswers;
                      })
                    }
                  />
                )}
              </div>
            ))}
          {!props.tasks && <p>Loading...</p>}
          <button className="check_button" onClick={checkAndEnd}>
            Перевірити
          </button>
        </div>
      </div>
    </div>
  );
};
export default MathTest;
