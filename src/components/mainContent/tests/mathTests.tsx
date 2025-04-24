import { Tasks, Task1, Task2, Task3 } from "../creatorVariant/types";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import TaskChoice from "./taskChoice";
import TaskComparison from "./taskComparison";
import TaskOpenAnswer from "./taskOpenAnswer";
interface CorrectComparison {
  [key: string]: string;
}

const MathTest = (props: { selectedVariant: string }) => {
  const [tasks, updateTasks] = useImmer<Tasks>({});
  const [userAnswers, updateUserAnswers] = useImmer<{ [key: string]: any }>({});
  const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
  const isTask2 = (task: any): task is Task2 =>
    task.typeOfTask === "comparison";
  const isTask3 = (task: any): task is Task3 =>
    task.typeOfTask === "openAnswer";

  const fetchTasks = async () => {
    try {
      const tasksCollectionRef = collection(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        "Mix",
        props.selectedVariant,
        "tasks"
      );

      const snapshot = await getDocs(tasksCollectionRef);
      const loadedTasks: Tasks = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (isTask1(data)) {
          loadedTasks[doc.id] = data as Task1;
        } else if (isTask2(data)) {
          loadedTasks[doc.id] = data as Task2;
        } else if (isTask3(data)) {
          loadedTasks[doc.id] = data as Task3;
        } else {
          console.warn(`Невідомий тип завдання (ID: ${doc.id})`, data);
        }
      });

      updateTasks(() => loadedTasks);
    } catch (error) {
      console.error("Помилка при завантаженні завдань:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
    tasks &&
      Object.entries(tasks).forEach(([key, item]) => {
        console.log(key);
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
          maxMark = maxMark + 2;
          if (item.correctAnswer === userAnswers[key]) {
            comparison[key] = 2;
            console.log(comparison);
          } else {
            comparison[key] = 0;
          }
        }
      });
    console.log(comparison);
    console.log(maxMark);
    let sum = 0;
    Object.values(comparison).map((value) => {
      sum = sum + value; // Додаємо значення
    });
    alert(
      "Твій бал за тест: " +
        sum +
        "\nТвій бал у форматі НМТ: " +
        Math.round((sum * 200) / maxMark)
    );
  };
  console.log();

  return (
    <div>
      <div className="conteiner_for_test">
        <div className="tests">
          {tasks &&
            Object.entries(tasks).map(([key, task]) => (
              <div key={key}>
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
          {!tasks && <p>Loading...</p>}
          <button className="check_button" onClick={testCheck}>
            Перевірити
          </button>
        </div>
      </div>
    </div>
  );
};
export default MathTest;
