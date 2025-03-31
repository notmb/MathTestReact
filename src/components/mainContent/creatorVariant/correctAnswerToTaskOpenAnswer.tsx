import { Task3 } from "./types";
const CorrectAnswerToTaskOpenAnswer = (props: {
  numTask: string;
  updataTaskData: (update: (draft: Task3) => void) => void;
}) => {
  const handleCorrectAnswerOfTaskChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    props.updataTaskData((draft) => {
      draft.correctAnswer = e.target.value;
    });
  };
  return (
    <fieldset className="data_correct_answer">
      <legend>Дані для правильної відповіді</legend>
      <label className="" htmlFor={`correct_answer-${props.numTask}`}>
        Вкажіть правильну відповідь
      </label>
      <textarea
        id={`correct_answer-${props.numTask}`}
        name={`correct_answer-${props.numTask}`}
        onChange={handleCorrectAnswerOfTaskChange}
      ></textarea>
    </fieldset>
  );
};
export default CorrectAnswerToTaskOpenAnswer;
