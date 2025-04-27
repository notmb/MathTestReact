import { Tasks, Task1, Task2, Task3 } from "../../creatorVariant/types";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { db } from "../../../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import Task from "./conditionOfTask";
import Answers from "./answersForTaskChoise";
import ComparisonData from "./comparison";
const TestReview = (props: { selectedVariant: string }) => {
  const [tasks, updateTasks] = useImmer<Tasks>({});
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
  return (
    <div className="box_for_test_review">
      <div className="test_review">
        {tasks &&
          Object.entries(tasks).map(([key, task]) => (
            <div key={key}>
              <p className="text-lg font-bold m-0">Завдання {key}</p>
              <Task
                selectedVariant={props.selectedVariant}
                text={task.task.text}
                picture={task.task.picture}
                list={task.task.list}
                table={task.task.table}
              ></Task>
              {isTask1(task) && (
                <Answers
                  selectedVariant={props.selectedVariant}
                  answers={task.answers}
                />
              )}
              {isTask2(task) && (
                <ComparisonData
                  selectedVariant={props.selectedVariant}
                  comparisonTable={task.comparisonTable}
                />
              )}
            </div>
          ))}
        {!tasks && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default TestReview;
