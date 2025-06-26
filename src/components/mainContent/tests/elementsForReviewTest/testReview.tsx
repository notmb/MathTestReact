import { Task1, Task2, Task3 } from "../../creatorVariant/types";

import { useVariantContext } from "../variantContext";
import Task from "./conditionOfTask";
import Answers from "./answersForTaskChoise";
import ComparisonData from "./comparison";

const TestReview = (props: { selectedVariant: string }) => {
  const { tasks } = useVariantContext();
  // const [tasks, updateTasks] = useImmer<Tasks>({});
  const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
  const isTask2 = (task: any): task is Task2 =>
    task.typeOfTask === "comparison";
  const isTask3 = (task: any): task is Task3 =>
    task.typeOfTask === "openAnswer";

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
                <div>
                  <Answers
                    selectedVariant={props.selectedVariant}
                    answers={task.answers}
                  />
                  <p>Відповідь: {task.correctAnswer}</p>
                </div>
              )}
              {isTask2(task) && (
                <div>
                  <ComparisonData
                    selectedVariant={props.selectedVariant}
                    comparisonTable={task.comparisonTable}
                  />
                  <p>
                    Відповідь: 1-{task.correctComparison[1]}; 2-
                    {task.correctComparison[2]}; 3-{task.correctComparison[3]}
                  </p>
                </div>
              )}
              {isTask3(task) && <p>Відповідь: {task.correctAnswer}</p>}
            </div>
          ))}

        {!tasks && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default TestReview;
