import "../tests.css";
import { MathJax } from "better-react-mathjax";

import { useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import type { Question, Comparison } from "../types";
import Picture from "./imageComponent";

const TaskComparison = (props: {
  selectedVariant: string;
  task: Question;
  comparisonTable: Comparison;
  number: string;
  updateUserAnswer: (userAnswer: string) => void;
}) => {
  return (
    <div className="tests_item">
      <p className="container_serial_num_task">Завдання {props.number}</p>
      <Task
        selectedVariant={props.selectedVariant}
        text={props.task.text}
        picture={props.task.picture}
        list={props.task.list}
        table={props.task.table}
      ></Task>
      <ComparisonTable
        selectedVariant={props.selectedVariant}
        comparisonTable={props.comparisonTable}
      ></ComparisonTable>
      <AnswerToComparisonTask
        number={props.number}
        comparisonTable={props.comparisonTable}
        updateUserAnswer={props.updateUserAnswer}
      ></AnswerToComparisonTask>
    </div>
  );
};

export default TaskComparison;

//КОМПОНЕНТ ЗАВДАННЯ
const Task = (props: {
  selectedVariant: string;
  text: string;
  table?: {
    value1: string[];
    value2: string[];
  };
  picture?: string;
  list?: string[];
}) => {
  return (
    <div className="task_box">
      <div className="text-2xl">
        <MathJax>{props.text}</MathJax>
      </div>
      {props.picture && (
        <Picture
          url={`${props.selectedVariant}/${props.picture}`}
          classForPicture="picture_for_question"
        ></Picture>
      )}
    </div>
  );
};
//КОМПОНЕНТ ЗАВДАННЯ

//КОМПОНЕНТ СПИСКИ ДЛЯ СПІВСТАВЛЕННЯ
const ComparisonTable = (props: {
  comparisonTable: Comparison;
  selectedVariant: string;
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  return (
    <div className="comparison_table">
      <div className="box_for_list1">
        <ul className="list1">
          {props.comparisonTable.list1.texts &&
            props.comparisonTable.list1.texts.map((item, index) => (
              <li key={index} className="item_of_comparison text-xl">
                {index + 1}) &nbsp;<MathJax>{item}</MathJax>
              </li>
            ))}
        </ul>
      </div>
      <div className="box_for_list2">
        {" "}
        <ul className="list2">
          {props.comparisonTable.list2.texts &&
            props.comparisonTable.list2.texts.map((item, index) => (
              <li key={index} className="item_of_comparison text-xl">
                {mark[index]}) &nbsp;<MathJax>{item}</MathJax>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
//КОМПОНЕНТ СПИСКИ ДЛЯ СПІВСТАВЛЕННЯ

//КОМПОНЕНТ ВІДПОВІДІ ДО ЗАВДАННЯ ІЗ СПІВСТАВЛЕННЯ
const AnswerToComparisonTask = (props: {
  number: string;
  comparisonTable: Comparison;
  updateUserAnswer: (userAnswer: any) => void;
}) => {
  const [inputValues, updateInputValues] = useImmer<{ [key: string]: string }>(
    () => {
      return (
        props.comparisonTable.list1.texts?.reduce((acc, _, index) => {
          acc[(index + 1).toString()] = "";
          return acc;
        }, {} as { [key: string]: string }) ?? {}
      );
    }
  );
  // Оновлюємо батьківський стан
  const updateUserAnswerRef = useRef(props.updateUserAnswer);

  updateUserAnswerRef.current = props.updateUserAnswer;
  useEffect(() => {
    updateUserAnswerRef.current(inputValues);
  }, [inputValues]);

  // Обробник зміни відповіді
  const handleChoiceChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const userAnswer = event.target.value; // Отримуємо вибрану відповідь
    updateInputValues((draft) => {
      draft[(index + 1).toString()] = userAnswer;
    });
  };

  return (
    <div className="box_for_answers_comparison">
      <ul className="list_of_answers_comparison">
        {props.comparisonTable.list1.texts &&
          props.comparisonTable.list1.texts.map((_, index) => (
            <li key={index} className="item_user_answer_comparison">
              {index + 1}) &nbsp;
              <select
                className="user_answer_comparison"
                id={props.number}
                value={inputValues[(index + 1).toString()] || ""}
                onChange={(e) => handleChoiceChange(e, index)}
              >
                <option value="">оберіть відповідь..</option>
                {["А", "Б", "В", "Г", "Д"]
                  .filter(
                    (opt) =>
                      !Object.values(inputValues).includes(opt) ||
                      inputValues[(index + 1).toString()] === opt
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
//КОМПОНЕНТ ВІДПОВІДІ ДО ЗАВДАННЯ ІЗ СПІВСТАВЛЕННЯ
