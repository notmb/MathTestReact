import "../../../style.css";
import { useState, useEffect } from "react";
import { MathJax } from "better-react-mathjax";
import type { Question, Answers } from "../oneTimeTest.types";
import { app } from "../../../../../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const TaskChoice = (props: {
  selectedVariant: string;
  task: Question;
  answers: Answers;
  number: string;
  currentAnswer?: string;
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
        currentAnswer={props.currentAnswer}
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
  currentAnswer?: string;
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
                name={`task-${props.number}`}
                checked={props.currentAnswer === item}
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

const fetchImage = async (url: string) => {
  console.log(url);
  const storage = getStorage(app); // Отримуємо екземпляр Storage
  const storageRef = ref(storage, url); // Шлях до файлу в Storage

  return getDownloadURL(storageRef);
};

//КОМПОНЕНТ ЗОБРАЖЕННЯ
const Picture = (props: { url: string; classForPicture: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImage(props.url).then((newUrl) => setImageUrl(newUrl)); // Викликаємо завантаження зображення при завантаженні компонента
  }, [props.url]);
  return (
    <div className="container_for_picture">
      {imageUrl ? (
        <img
          className={props.classForPicture}
          src={imageUrl}
          alt="Loaded from Firebase"
        />
      ) : (
        <p>Завантаження зображення...</p>
      )}
    </div>
  );
};
//КОМПОНЕНТ ЗОБРАЖЕННЯ

const TableForAnswersToTaskChoice = (props: {
  answers: Answers;
  selectedVariant: string;
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  return (
    <div>
      <div className="answer_table1">
        {[0, 1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className={`columns_in_answers_table columns_in_answers_table_${index}`}
          >
            <div className="mark_in_answers_table font-bold text-xl">
              {mark[index]}
            </div>
            <div className="option_in_answers_table text-xl ">
              {props.answers.pictures && props.answers.pictures[index] && (
                <Picture
                  url={`${props.selectedVariant}/${props.answers.pictures[index]}`}
                  classForPicture="picture_for_answer"
                ></Picture>
              )}
              {props.answers.values && props.answers.values[index] && (
                <MathJax>{props.answers.values[index]}</MathJax>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
