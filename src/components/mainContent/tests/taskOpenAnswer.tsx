import "../tests.css";
import { MathJax } from "better-react-mathjax";
import { app } from "../../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import type { Question } from "../creatorVariant/types";

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
      <div>
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

const fetchImage = async (url: string) => {
  const storage = getStorage(app); // Отримуємо екземпляр Storage
  const storageRef = ref(storage, url); // Шлях до файлу в Storage

  return getDownloadURL(storageRef);
};

//КОМПОНЕНТ ЗОБРАЖЕННЯ ДЛЯ ЗАВДАННЯ
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
//КОМПОНЕНТ ЗОБРАЖЕННЯ ДЛЯ ЗАВДАННЯ

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
