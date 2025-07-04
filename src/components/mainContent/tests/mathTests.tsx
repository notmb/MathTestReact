import { Tasks, Task1, Task2, Task3 } from "../creatorVariant/types";
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
  const [mark, setMark] = useState<string>("0");
  const [pointsForTasks, updatePointForTask] = useImmer<{ [key: string]: any }>(
    {}
  );
  const [timeOut, setTimeOut] = useState<boolean>(false);

  console.log(mark, pointsForTasks);
  console.log(userAnswers);
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
            console.log(comparison);
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
    updatePointForTask(() => {
      return comparison;
    });
    console.log(comparison);
    console.log(maxMark);
    let sum = 0;
    Object.values(comparison).map((value) => {
      sum = sum + value; // Додаємо значення
    });
    const nmtMark = Math.round((sum * 200) / maxMark);
    setMark(
      sum.toString() + "/" + Math.round((sum * 200) / maxMark).toString()
    );
    alert(
      "Твій бал за тест: " +
        sum +
        "\nТвій бал у форматі НМТ: " +
        Math.round((sum * 200) / maxMark)
    );
    return { sum, nmtMark, comparison };
  };
  //ПЕРЕВІРКА

  const checkAndEnd = () => {
    const result = testCheck();
    console.log(props.endTest);
    props.endTest &&
      props.endTest(
        userAnswers,
        `${result.sum}/${result.nmtMark}`,
        result.comparison
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
      {props.endTest && (
        <Timer endTest={props.endTest} setTimeOut={setTimeOut}></Timer>
      )}
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
