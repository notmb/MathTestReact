import { MathJax } from "better-react-mathjax";
import type { Comparison, Question } from "../oneTimeTest.types";
import TaskBody from "../components/taskBody";
import FirebasePicture from "../components/FirebasePicture";

const marks = ["А", "Б", "В", "Г", "Д"];

const TaskComparison = (props: {
  selectedVariant: string;
  task: Question;
  comparisonTable: Comparison;
  number: string;
  currentAnswer?: Record<string, string>;
  updateUserAnswer: (userAnswer: Record<string, string>) => void;
}) => {
  return (
    <div className="tests-item">
      <p className="container-serial-num-task">Завдання {props.number}</p>
      <TaskBody selectedVariant={props.selectedVariant} task={props.task}></TaskBody>
      <ComparisonTable
        comparisonTable={props.comparisonTable}
        selectedVariant={props.selectedVariant}
      ></ComparisonTable>
      <AnswerToComparisonTask
        number={props.number}
        comparisonTable={props.comparisonTable}
        currentAnswer={props.currentAnswer}
        updateUserAnswer={props.updateUserAnswer}
      ></AnswerToComparisonTask>
    </div>
  );
};

export default TaskComparison;

const ComparisonTable = (props: {
  comparisonTable: Comparison;
  selectedVariant: string;
}) => {
  return (
    <div className="comparison-table">
      <ComparisonColumn
        items={props.comparisonTable.list1.texts}
        pictures={props.comparisonTable.list1.pictures}
        selectedVariant={props.selectedVariant}
        getMark={(index) => `${index + 1})`}
      />
      <ComparisonColumn
        items={props.comparisonTable.list2.texts}
        pictures={props.comparisonTable.list2.pictures}
        selectedVariant={props.selectedVariant}
        getMark={(index) => `${marks[index] ?? ""})`}
      />
    </div>
  );
};

const ComparisonColumn = (props: {
  items?: string[];
  pictures?: string[];
  selectedVariant: string;
  getMark: (index: number) => string;
}) => {
  const rowCount = Math.max(
    props.items?.length ?? 0,
    props.pictures?.length ?? 0,
  );

  return (
    <div className="box-for-list1">
      <ul className="list1">
        {Array.from({ length: rowCount }, (_, index) => {
          const text = props.items?.[index];
          const picture = props.pictures?.[index];

          return (
            <li key={index} className="item-of-comparison text-xl">
              {props.getMark(index)} &nbsp;
              {text && <MathJax>{text}</MathJax>}
              {picture && (
                <FirebasePicture
                  url={`${props.selectedVariant}/${picture}`}
                  className="review-answer-picture"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const AnswerToComparisonTask = (props: {
  number: string;
  comparisonTable: Comparison;
  currentAnswer?: Record<string, string>;
  updateUserAnswer: (userAnswer: Record<string, string>) => void;
}) => {
  const inputValues = props.currentAnswer ?? {};
  const rowCount = Math.max(
    props.comparisonTable.list1.texts?.length ?? 0,
    props.comparisonTable.list1.pictures?.length ?? 0,
  );

  const handleChoiceChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const key = (index + 1).toString();
    const userAnswer = event.target.value;
    props.updateUserAnswer({
      ...inputValues,
      [key]: userAnswer,
    });
  };

  return (
    <div className="box-for-answers-comparison">
      <ul className="list-of-answers-comparison">
        {Array.from({ length: rowCount }, (_, index) => (
            <li key={index} className="item-user-answer-comparison">
              {index + 1}) &nbsp;
              <select
                className="user-answer-comparison"
                id={`${props.number}-${index}`}
                value={inputValues[(index + 1).toString()] || ""}
                onChange={(e) => handleChoiceChange(e, index)}
              >
                <option value="">оберіть відповідь..</option>
                {["А", "Б", "В", "Г", "Д"]
                  .filter(
                    (opt) =>
                      !Object.values(inputValues).includes(opt) ||
                      inputValues[(index + 1).toString()] === opt,
                  )
                  .map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
              </select>
            </li>
          ))}
      </ul>
    </div>
  );
};
