import "./tests.css";
import { MathJax } from "better-react-mathjax";
import { app } from "../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

interface Question {
  text: string;
  table?: {
    value1: string[];
    value2: string[];
  };
  picture?: string;
  list?: string[];
}
interface Answers {
  values: string[];
  pictures?: string[];
}
const TaskChoice = (props: {
  task: Question;
  answers: Answers;
  correctAnswer: string;
  typeOfTask: string;
  number: string;
  func: (taskKey: string, userAnswer: string) => void;
}) => {
  if (props.number === (3).toString()) {
    console.log(props.task.table);
  }
  return (
    <div className="tests_item">
      <p className="container_serial_num_task">Завдання {props.number}</p>
      <Task
        text={props.task.text}
        picture={props.task.picture}
        list={props.task.list}
        table={props.task.table}
      ></Task>
      <Answers answers={props.answers}></Answers>
      <AnswerChoice
        EditUserAnswer={props.func}
        number={props.number}
      ></AnswerChoice>
    </div>
  );
};

export default TaskChoice;

//КОМПОНЕНТ ЗАВДАННЯ
const Task = (props: {
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
      <div>
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
          url={props.picture}
          classForPicture="picture_for_question"
        ></Picture>
      )}
    </div>
  );
};
//КОМПОНЕНТ ЗАВДАННЯ

const fetchImage = async (url: string) => {
  const storage = getStorage(app); // Отримуємо екземпляр Storage
  const storageRef = ref(storage, `variant 5/${url}`); // Шлях до файлу в Storage

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

//КОМПОНЕНТ ДЛЯ ВІДПОВІДЕЙ
const Answers = (props: { answers: Answers }) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  // const urlForAnswer = PictureForAnswers(props.imageForAnswers);
  return (
    <div className="box_for_answer_table">
      <table className="answer_table">
        <thead>
          <tr>
            {mark.map((item, index) => (
              <td key={index} className="mark">
                {item}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr id="answers" className="box_answers">
            {props.answers.values.map((item, index) => (
              <td key={index} className="answer_options">
                {props.answers.pictures && (
                  <Picture
                    url={props.answers.pictures[index]}
                    classForPicture="picture_for_answer"
                  ></Picture>
                )}
                <MathJax>{item}</MathJax>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
//КОМПОНЕНТ ДЛЯ ВІДПОВІДЕЙ

//КОМПОНЕНТ ДЛЯ ВИБОРУ ВІДПОВІДІ
const AnswerChoice = (props: {
  number: string;
  EditUserAnswer: (taskKey: string, userAnswer: string) => void;
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  // Обробник зміни відповіді
  const handleChoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = event.target.value; // Отримуємо вибрану відповідь
    const taskKey = event.target.id;
    props.EditUserAnswer(taskKey, userAnswer); // Викликаємо функцію для оновлення відповіді
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
                <span className="answer">{item}</span>
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
};
//КОМПОНЕНТ ДЛЯ ВИБОРУ ВІДПОВІДІ
