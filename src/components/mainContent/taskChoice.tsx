import "./testItem.css";
import { MathJax } from "better-react-mathjax";
import { app } from "../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

interface Answers {
  values: string[];
  pictures?: string[];
}
const TaskChoice = (props: {
  task: {
    text: string;
    table?: {
      value1: string[];
      velue2: string[];
    };
    image?: string;
    list?: string[];
  };
  answers: {
    values: string[];
    pictures?: string[];
  };
  correctAnswer: string;
  typeOfTask: string;
  number: string;
  func: (taskKey: string, userAnswer: string) => void;
}) => {
  return (
    <div className="tests_item">
      <Task text={props.task.text}></Task>

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
    velue2: string[];
  };
  picture?: string;
  list?: string[];
}) => {
  return (
    <div className="task_box">
      <div>
        <MathJax>{props.text}</MathJax>
      </div>
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
    <div>
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

//КОМПОНЕНТ ДЛЯ ВІДПОВІДЕЙ
const Answers = (props: { answers: Answers }) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  // const urlForAnswer = PictureForAnswers(props.imageForAnswers);
  return (
    <div>
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
          <tr id="answers">
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
    <div className="box_form">
      <form className="form_for_answer" action="#" method="post">
        {mark.map((item, index) => {
          return (
            <div className="box_choise" key={index}>
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
