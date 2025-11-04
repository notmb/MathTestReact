import { Task1, Task2, Task3 } from "../types";

import { useVariantContext } from "../../../context/variantContext";
import TaskChoice from "./taskChoice";
import TaskComparison from "./taskComparison";
import TaskOpenAnswer from "./taskOpenAnswer";

const MathTest2 = (props: { updateUserAnswers: (draft: any) => void }) => {
  const { tasks, dataVariant } = useVariantContext();

  if (!tasks) return <p>Завантаження...</p>;

  const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
  const isTask2 = (task: any): task is Task2 =>
    task.typeOfTask === "comparison";
  const isTask3 = (task: any): task is Task3 =>
    task.typeOfTask === "openAnswer";

  return (
    <div className="conteiner_for_test">
      <div className="tests">
        {tasks &&
          Object.entries(tasks).map(([key, task]) => (
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
                    запишіть у спеціально відведеному місці. Відповідь записуйте
                    лише десятĸовим дробом.
                  </h2>
                </div>
              )}
              {isTask1(task) && (
                <TaskChoice
                  selectedVariant={dataVariant.id || ""}
                  task={task.task}
                  answers={task.answers}
                  number={key}
                  updateUserAnswer={(idTask: string, userAnswers: any) =>
                    props.updateUserAnswers((draft: { [x: string]: any }) => {
                      draft[idTask] = userAnswers;
                    })
                  }
                />
              )}
              {isTask2(task) && (
                <TaskComparison
                  selectedVariant={dataVariant.id || ""}
                  task={task.task}
                  comparisonTable={task.comparisonTable}
                  number={key}
                  updateUserAnswer={(userAnswers: any) => {
                    props.updateUserAnswers((draft: { [x: string]: any }) => {
                      draft[key] = userAnswers;
                    });
                  }}
                />
              )}
              {isTask3(task) && (
                <TaskOpenAnswer
                  selectedVariant={dataVariant.id || ""}
                  task={task.task}
                  number={key}
                  updateUserAnswer={(idTask: string, userAnswers: any) =>
                    props.updateUserAnswers((draft: { [x: string]: any }) => {
                      draft[idTask] = userAnswers;
                    })
                  }
                />
              )}
            </div>
          ))}
        {tasks && <p>Loading...</p>}
      </div>
    </div>
  );
};
export default MathTest2;
