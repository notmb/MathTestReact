import { MathJax } from "better-react-mathjax";
import type { Answers, Question } from "../oneTimeTest.types";
import FirebasePicture from "../components/FirebasePicture";
import TaskBody from "../components/taskBody";

const TaskChoice = (props: {
  selectedVariant: string;
  task: Question;
  answers: Answers;
  number: string;
  currentAnswer?: string;
  updateUserAnswer: (idTask: string, userAnswer: string) => void;
}) => {
  return (
    <div className="tests-item">
      <p className="container-serial-num-task">Завдання {props.number}</p>
      <TaskBody selectedVariant={props.selectedVariant} task={props.task}></TaskBody>
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

const AnswerChoice = (props: {
  number: string;
  currentAnswer?: string;
  updateUserAnswer: (idTask: string, userAnswer: string) => void;
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];

  const handleChoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = event.target.value;
    props.updateUserAnswer(props.number, userAnswer);
  };

  return (
    <div className="box-for-user-answers">
      <form className="form-for-user-answer" action="#" method="post">
        {mark.map((item, index) => {
          return (
            <div className="item-answer-choice" key={index}>
              <input
                className="user-choice"
                key={index}
                type="radio"
                id={props.number + index}
                value={item}
                name={`task-${props.number}`}
                checked={props.currentAnswer === item}
                onChange={handleChoiceChange}
              />
              <label className="label" htmlFor={props.number + index}>
                <span className="answer">&nbsp; {item}</span>
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
};

const TableForAnswersToTaskChoice = (props: {
  answers: Answers;
  selectedVariant: string;
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];

  return (
    <div>
      <div className="answer-table1">
        {[0, 1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className={`columns-in-answers-table columns-in-answers-table-${index}`}
          >
            <div className="mark-in-answers-table font-bold text-xl">
              {mark[index]}
            </div>
            <div className="option-in-answers-table text-xl ">
              {props.answers.pictures && props.answers.pictures[index] && (
                <FirebasePicture
                  url={`${props.selectedVariant}/${props.answers.pictures[index]}`}
                  className="picture-for-answer"
                ></FirebasePicture>
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



