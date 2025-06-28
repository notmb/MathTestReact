import "../tests.css";
import { MathJax } from "better-react-mathjax";
import type { Question, Answers } from "../creatorVariant/types";
import TableForAnswersToTaskChoice from "./tableForAnswers";
import Picture from "./imageComponent";

const TaskChoice = (props: {
  selectedVariant: string;
  task: Question;
  answers: Answers;
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
        list={props.task.list}
        table={props.task.table}
      ></Task>
      <TableForAnswersToTaskChoice
        selectedVariant={props.selectedVariant}
        answers={props.answers}
      ></TableForAnswersToTaskChoice>
      <AnswerChoice
        updateUserAnswer={props.updateUserAnswer}
        number={props.number}
      ></AnswerChoice>
    </div>
  );
};

export default TaskChoice;

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
      {props.list && <ListToQestion list={props.list}></ListToQestion>}
      {props.table && (
        <TableToQestion
          list1={props.table.value1}
          list2={props.table.value2}
        ></TableToQestion>
      )}
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

//КОМПОНЕНТ СПИСКУ ДО ЗАПИТАННЯ
const ListToQestion = (props: { list: string[] }) => {
  return (
    <div className="box_for_list_in_task">
      {props.list.map((item, index) => (
        <span key={index} className="list_in_task">
          {index + 1}. <MathJax>{item}</MathJax>
        </span>
      ))}
    </div>
  );
};
//КОМПОНЕНТ СПИСКУ ДО ЗАПИТАННЯ

//КОМПОНЕНТ ТАБЛИЦІ ДО ЗАПИТАННЯ
const TableToQestion = (props: { list1: string[]; list2: string[] }) => {
  return (
    <div className="box_for_table_in_task">
      <table className="table_to_qestion">
        <tbody>
          <tr>
            {props.list1.map((item, index) => (
              <td key={index} className="table_to_qestion_list1">
                <MathJax>{item}</MathJax>
              </td>
            ))}
          </tr>
          <tr>
            {props.list2.map((item, index) => (
              <td key={index} className="table_to_qestion_list2">
                <MathJax>{item}</MathJax>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
//КОМПОНЕНТ ТАБЛИЦІ ДО ЗАПИТАННЯ

//КОМПОНЕНТ ДЛЯ ВИБОРУ ВІДПОВІДІ
const AnswerChoice = (props: {
  number: string;
  updateUserAnswer: (idTask: string, userAnswer: string) => void;
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  // Обробник зміни відповіді
  const handleChoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = event.target.value; // Отримуємо вибрану відповідь
    props.updateUserAnswer(props.number, userAnswer); // Викликаємо функцію для оновлення відповіді
  };
  return (
    <div className="box_for_user_answers">
      <form className="form_for_user_answer" action="#" method="post">
        {mark.map((item, index) => {
          return (
            <div className="item_answer_choise" key={index}>
              <input
                className="user_choice"
                key={index}
                type="radio"
                id={props.number}
                value={item}
                name={"task"}
                onChange={handleChoiceChange}
              />
              <label className="label" htmlFor={item}>
                <span className="answer">&nbsp; {item}</span>
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
};
//КОМПОНЕНТ ДЛЯ ВИБОРУ ВІДПОВІДІ
