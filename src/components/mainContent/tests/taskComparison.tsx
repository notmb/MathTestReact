import "../tests.css";
import { MathJax } from "better-react-mathjax";
import { app } from "../../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import type { Question, Comparison } from "../creatorVariant/types";

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
        text={props.task.text}
        selectedVariant={props.selectedVariant}
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
    event: React.ChangeEvent<HTMLInputElement>,
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
              <input
                className="user_answer_comparison"
                id={props.number}
                list={`answer-${index}`}
                placeholder="your answer..."
                onChange={(event) => handleChoiceChange(event, index)}
              />
              <datalist id={`answer-${index}`}>
                {["А", "Б", "В", "Г", "Д"].map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </li>
          ))}
      </ul>
    </div>
  );
};
//КОМПОНЕНТ ВІДПОВІДІ ДО ЗАВДАННЯ ІЗ СПІВСТАВЛЕННЯ
