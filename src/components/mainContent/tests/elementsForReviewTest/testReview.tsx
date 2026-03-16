import { useState } from "react";
import "./reviewTest.css";
import { WrapperForModalWindow } from "../../reactTsUtils";
import type { SupportedTask } from "../taskGuards";
import { isTask1, isTask2 } from "../taskGuards";
import TaskEditor from "../taskEditor";
import { useVariantContext } from "../variantContext";
import Answers from "./answersForTaskChoise";
import ComparisonData from "./comparison";
import Task from "./conditionOfTask";

const formatComparisonAnswer = (correctComparison: Record<string, string>) =>
  Object.entries(correctComparison)
    .map(([key, value]) => `${key}-${value}`)
    .join("; ");

const renderTaskContent = (task: SupportedTask, selectedVariant: string) => {
  if (isTask1(task)) {
    return (
      <Answers
        selectedVariant={selectedVariant}
        answers={task.answers}
      ></Answers>
    );
  }

  if (isTask2(task)) {
    return (
      <ComparisonData
        selectedVariant={selectedVariant}
        comparisonTable={task.comparisonTable}
      ></ComparisonData>
    );
  }

  return null;
};

const getCorrectAnswerText = (task: SupportedTask) => {
  if (isTask1(task)) {
    return task.correctAnswer;
  }

  if (isTask2(task)) {
    return formatComparisonAnswer(task.correctComparison);
  }

  return task.correctAnswer;
};

const TestReview = (props: { selectedVariant: string }) => {
  const { tasks, isLoading, errorMessage } = useVariantContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numTaskForEditing, setNumTaskForEditing] = useState<string>("");

  const taskForEditingSelected = (num: string) => {
    setNumTaskForEditing(num);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="review-test-shell">
        <p>Завантаження тесту...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="review-test-shell">
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (Object.keys(tasks).length === 0) {
    return (
      <div className="review-test-shell">
        <p>У вибраному тесті ще немає завдань.</p>
      </div>
    );
  }

  return (
    <div className="review-test-shell">
      <div className="review-test-list">
        {Object.entries(tasks).map(([key, task]) => (
          <article key={key} className="review-task-card">
            <div className="review-task-header">
              <p className="text-lg font-bold m-0">Завдання {key}</p>
              <button
                className="review-task-edit-button"
                onClick={() => {
                  taskForEditingSelected(key);
                }}
              >
                Редагувати
              </button>
            </div>

            <div className="review-task-card-body">
              <Task
                selectedVariant={props.selectedVariant}
                text={task.task.text}
                picture={task.task.picture}
                list={task.task.list}
                table={task.task.table}
              ></Task>

              <div className="review-task-card-content">
                {renderTaskContent(task, props.selectedVariant)}
              </div>

              <div className="review-task-card-answer">
                <p>Правильна відповідь: {getCorrectAnswerText(task)}</p>
              </div>
            </div>
          </article>
        ))}
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
