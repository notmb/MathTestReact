import { MathJax } from "better-react-mathjax";
import type { Comparison, Question } from "../oneTimeTest.types";
import TaskBody from "../components/taskBody";

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
      <ComparisonTable comparisonTable={props.comparisonTable}></ComparisonTable>
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
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];

  return (
    <div className="comparison-table">
      <div className="box-for-list1">
        <ul className="list1">
          {props.comparisonTable.list1.texts &&
            props.comparisonTable.list1.texts.map((item, index) => (
              <li key={index} className="item-of-comparison text-xl">
                {index + 1}) &nbsp;<MathJax>{item}</MathJax>
              </li>
            ))}
        </ul>
      </div>
      <div className="box-for-list2">
        <ul className="list2">
          {props.comparisonTable.list2.texts &&
            props.comparisonTable.list2.texts.map((item, index) => (
              <li key={index} className="item-of-comparison text-xl">
                {mark[index]}) &nbsp;<MathJax>{item}</MathJax>
              </li>
            ))}
        </ul>
      </div>
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
        {props.comparisonTable.list1.texts &&
          props.comparisonTable.list1.texts.map((_, index) => (
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



