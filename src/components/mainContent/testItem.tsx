import "./testItem.css";
import { MathJax } from "better-react-mathjax";
import { app } from "../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

interface Answers {
  value: string[];
  pictures: string[];
}
interface Comparison {
  list1: string[];
  list2: string[];
}
interface TaskData {
  task: string[];
  answers: Answers;
  correctAnswer: string;
  typeOfTask: string;
  comparisonTable: Comparison;
  correctComparison: string[];
}

const TestsItem = (props: {
  task: string[];
  answers: Answers;
  typeOfTask: string;
  comparisonTable: Comparison;
  number: string;
}) => {
  console.log(props.number);
  return (
    <div className="tests_item">
      <Task task={props.task} number={props.number}></Task>
      {props.typeOfTask == "choice" && (
        <>
          <Answers answers={props.answers}></Answers>
          <AnswerChoice></AnswerChoice>
        </>
      )}
      {props.typeOfTask == "comparison" && (
        <>
          {" "}
          <ComparisonTable
            comparisonTable={props.comparisonTable}
          ></ComparisonTable>{" "}
          <AnswerToComparisonTask
            comparisonTable={props.comparisonTable}
          ></AnswerToComparisonTask>
        </>
      )}
      {props.typeOfTask == "openAnswer" && <OpenAnswer></OpenAnswer>}
    </div>
  );
};

export default TestsItem;

//КОМПОНЕНТ ЗАВДАННЯ
const Task = (props: { task: string[]; number: string }) => {
  if (props.task[1]) {
    console.log(props.task[1]);
  }
  return (
    <div className="question_box">
      <div>
        <MathJax>
          {props.number}. {props.task[0]}
        </MathJax>
      </div>
      {props.task[1] && (
        <Picture
          url={props.task[1]}
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

//КОМПОНЕНТ ДЛЯ ВІДПОВІДЕЙ
const Answers = (props: { answers: Answers }) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  // const urlForAnswer = PictureForAnswers(props.imageForAnswers);
  const isPictures = props.answers.pictures.length < 4 ? false : true;
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
            {props.answers.value.map((item, index) => (
              <td key={index} className="answer_options">
                {isPictures && (
                  <Picture
                    url={props.answers.pictures[index]}
                    classForPicture="picture_for_answer"
                  ></Picture>
                )}
                <MathJax>{props.answers.value[index]}</MathJax>
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
const AnswerChoice = () => {
  const mark = ["А", "Б", "В", "Г", "Д"];

  return (
    <div className="box_form">
      <form className="form_for_answer" action="#" method="post">
        {mark.map((item, index) => {
          return (
            <div className="box_choise" key={index}>
              <input
                className="user_choice"
                type="radio"
                id={item}
                value={item}
                name={"task"}
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

//КОМПОНЕНТ СПИСКИ ДЛЯ СПІВСТАВЛЕННЯ
const ComparisonTable = (props: { comparisonTable: Comparison }) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  return (
    <div className="comparison_table">
      <div className="list1">
        <ul>
          {props.comparisonTable.list1.map((item, index) => (
            <li key={index} className="list_item">
              {index + 1}) <MathJax>{item}</MathJax>
            </li>
          ))}
        </ul>
      </div>
      <div className="list2">
        {" "}
        <ul>
          {props.comparisonTable.list2.map((item, index) => (
            <li key={index} className="list_item">
              {mark[index]}) <MathJax>{item}</MathJax>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
//КОМПОНЕНТ СПИСКИ ДЛЯ СПІВСТАВЛЕННЯ

//КОМПОНЕНТ ВІДПОВІДІ ДО ЗАВДАННЯ ІЗ СПІВСТАВЛЕННЯ
const AnswerToComparisonTask = (props: { comparisonTable: Comparison }) => {
  return (
    <div>
      <div className="list1">
        <ul>
          {props.comparisonTable.list1.map((item, index) => (
            <li key={index} className="list_item">
              {index + 1})
              <input list="fruits" placeholder="your answer..." />
              <datalist id="fruits">
                {["А", "Б", "В", "Г", "Д"].map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
//КОМПОНЕНТ ВІДПОВІДІ ДО ЗАВДАННЯ ІЗ СПІВСТАВЛЕННЯ

//КОМПОНЕНТ ВІДПОВІДІ ДО ЗАВДАННЯ З ВІДКРИТОЮ ВІДПОВІДДЮ
const OpenAnswer = () => {
  return (
    <div className="open_answer">
      <input type="text" placeholder="your answer..." />
    </div>
  );
};
//КОМПОНЕНТ ВІДПОВІДІ ДО ЗАВДАННЯ З ВІДКРИТОЮ ВІДПОВІДДЮ
