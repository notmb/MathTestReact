import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import "./testsItem.css";
import { MathJax } from "better-react-mathjax";

interface Test {
  question: string;
  answers: string[];
  correctAnswer: string;
  pictureForAnswers: string[];
  pictureForQuestion: string;
}
//ГОЛОВНИЙ КОМПОНЕНТ
const TestsItem = (props: {
  testItem: Test;
  id: string;
  func: (id: string, currentAnswer: string) => void;
}) => {
  return (
    <div className="task">
      <Task
        task={props.testItem.question}
        imgForQuestion={props.testItem.pictureForQuestion}
        // imgForQuestion={""}
      ></Task>
      <Answers
        answers={props.testItem.answers}
        imageForAnswers={props.testItem.pictureForAnswers}
      ></Answers>
      <AnswerChoice
        answers={props.testItem.answers}
        id={props.id}
        func={props.func}
      ></AnswerChoice>
    </div>
  );
};
export default TestsItem;
//ГОЛОВНИЙ КОМПОНЕНТ
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

//КОМПОНЕНТ ЗАВДАННЯ
const Task = (props: { task: string; imgForQuestion: string }) => {
  if (props.imgForQuestion) {
    console.log(props.imgForQuestion);
  }
  return (
    <div className="question_box">
      <div>
        <MathJax>{props.task}</MathJax>
      </div>
      {props.imgForQuestion && (
        <Picture
          url={props.imgForQuestion}
          classForPicture="picture_for_question"
        ></Picture>
      )}
    </div>
  );
};
//КОМПОНЕНТ ЗАВДАННЯ

//КОМПОНЕНТ ДЛЯ ВІДПОВІДЕй
const Answers = (props: { answers: string[]; imageForAnswers: string[] }) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  // const urlForAnswer = PictureForAnswers(props.imageForAnswers);
  const pictureIsPresent = props.imageForAnswers.length < 4 ? false : true;
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
            {props.answers.map((item, index) => (
              <td key={index} className="answer_options">
                {pictureIsPresent && (
                  <Picture
                    url={props.imageForAnswers[index]}
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
  answers: string[];
  id: string;
  func: (id: string, currentAnswer: string) => void;
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  const [answer, setAnswer] = useState<{ userAnswer: string; id: string }>({
    userAnswer: "",
    id: "",
  });
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id2 = event.target.name.match(/\d+/g)?.join("");
    setAnswer({ userAnswer: event.target.value, id: id2 || "" });
    props.func(answer.id, answer.userAnswer);
  };

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
                name={"task" + props.id}
                onChange={handleOptionChange}
              />
              <label className="label" htmlFor={item}>
                <span className="answer" data-value={props.answers[index]}>
                  {item}(
                  <span>
                    <MathJax>{props.answers[index]}</MathJax>
                  </span>
                  )
                </span>
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
};
//КОМПОНЕНТ ДЛЯ ВИБОРУ ВІДПОВІДІ
