import { Task1, Task2, Task3 } from "../../types";
import TaskEditor from "../taskEditor";
import { useVariantContext } from "../variantContext";
import Task from "./conditionOfTask";
import Answers from "./answersForTaskChoise";
import ComparisonData from "./comparison";
import { WrapperForModalWindow } from "../../reactTsUtils";
import { useState } from "react";

const TestReview = (props: { selectedVariant: string }) => {
  const { tasks } = useVariantContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numTaskForEditing, setNumTaskForEditing] = useState<string>("");

  const isEditingEnabled = true;
  const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
  const isTask2 = (task: any): task is Task2 =>
    task.typeOfTask === "comparison";
  const isTask3 = (task: any): task is Task3 =>
    task.typeOfTask === "openAnswer";
  const taskForEditingSelected = (num: string) => {
    setNumTaskForEditing(num);
    setIsModalOpen(true);
  };
  return (
    <div className="box_for_test_review">
      <div className="test_review">
        {tasks &&
          Object.entries(tasks).map(([key, task]) => (
            <div key={key}>
              <div className="container_for_num_task">
                <p className="text-lg font-bold m-0">Завдання {key}</p>
                {isEditingEnabled && (
                  <button
                    className="custom_edit_button"
                    onClick={() => {
                      taskForEditingSelected(key);
                    }}
                  >
                    edit
                  </button>
                )}
              </div>

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
                  {task.correctComparison && (
                    <p>
                      Відповідь: 1-{task.correctComparison[1]}; 2-
                      {task.correctComparison[2]}; 3-{task.correctComparison[3]}
                    </p>
                  )}
                </div>
              )}
              {isTask3(task) && <p>Відповідь: {task.correctAnswer}</p>}
            </div>
          ))}

        {!tasks && <p>Loading...</p>}
      </div>

      {isModalOpen && (
        <WrapperForModalWindow onClose={() => setIsModalOpen(false)}>
          <TaskEditor
            numTask={numTaskForEditing}
            selectedVariant={props.selectedVariant}
            onSuccess={() => setIsModalOpen(false)}
          ></TaskEditor>
        </WrapperForModalWindow>
      )}
    </div>
  );
};

export default TestReview;
