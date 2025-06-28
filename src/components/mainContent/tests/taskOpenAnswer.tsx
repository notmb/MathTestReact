import "../tests.css";
import { MathJax } from "better-react-mathjax";

import type { Question } from "../creatorVariant/types";
import Picture from "./imageComponent";

const TaskOpenAnswer = (props: {
  selectedVariant: string;
  task: Question;
  number: string;
  updateUserAnswer: (idTask: string, userAnswer: string) => void;
}) => {
  return (
    <div className="tests_item">
      <p className="container_serial_num_task">Завдання {props.number}</p>
      <Task
        selectedVariant={props.selectedVariant}
        text={props.task.text}
        picture={props.task.picture}
      ></Task>
      <OpenAnswer
        number={props.number}
        updateUserAnswer={props.updateUserAnswer}
      ></OpenAnswer>
    </div>
  );
};

export default TaskOpenAnswer;

//КОМПОНЕНТ ЗАВДАННЯ
const Task = (props: {
  selectedVariant: string;
  text: string;
  table?: {
    value1: string[];
    velue2: string[];
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

//КОМПОНЕНТ ВІДПОВІДІ ДО ЗАВДАННЯ З ВІДКРИТОЮ ВІДПОВІДДЮ
const OpenAnswer = (props: {
  number: string;
  updateUserAnswer: (idTask: string, userAnswer: string) => void;
}) => {
  const handleChoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = event.target.value; // Отримуємо вибрану відповідь

    props.updateUserAnswer(props.number, userAnswer); // Викликаємо функцію для оновлення відповіді
  };
  return (
    <div className="box_for_user_answer">
      <input
        className="user_answer_open"
        id={props.number}
        type="text"
        placeholder="your answer..."
        onChange={handleChoiceChange}
      />
    </div>
  );
};
//КОМПОНЕНТ ВІДПОВІДІ ДО ЗАВДАННЯ З ВІДКРИТОЮ ВІДПОВІДДЮ
