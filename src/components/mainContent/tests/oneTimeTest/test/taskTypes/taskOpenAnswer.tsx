import type { Question } from "../oneTimeTest.types";
import TaskBody from "../components/taskBody";

const TaskOpenAnswer = (props: {
  selectedVariant: string;
  task: Question;
  number: string;
  currentAnswer?: string;
  updateUserAnswer: (idTask: string, userAnswer: string) => void;
}) => {
  return (
    <div className="tests-item">
      <p className="container-serial-num-task">Завдання {props.number}</p>
      <TaskBody selectedVariant={props.selectedVariant} task={props.task}></TaskBody>
      <OpenAnswer
        number={props.number}
        currentAnswer={props.currentAnswer}
        updateUserAnswer={props.updateUserAnswer}
      ></OpenAnswer>
    </div>
  );
};

export default TaskOpenAnswer;

const OpenAnswer = (props: {
  number: string;
  currentAnswer?: string;
  updateUserAnswer: (idTask: string, userAnswer: string) => void;
}) => {
  const handleChoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = event.target.value;
    props.updateUserAnswer(props.number, userAnswer);
  };

  return (
    <div className="box-for-user-answer">
      <input
        className="user-answer-open"
        id={props.number}
        type="number"
        placeholder="відповідь.."
        value={props.currentAnswer ?? ""}
        onChange={handleChoiceChange}
      />
    </div>
  );
};



