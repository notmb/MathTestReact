import { Task2 } from "./types";
const CorrectAnswerToTaskMatching = (props: {
  numTask: string;
  updataTaskData: (update: (draft: Task2) => void) => void;
}) => {
  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    item: string
  ) => {
    console.log(item);
    props.updataTaskData((draft) => {
      if (!draft.correctComparison) {
        draft.correctComparison = {};
      }
      draft.correctComparison[item] = e.target.value;
    });
  };
  return (
    <fieldset className="data_correct_answer">
      <legend>Дані для правильної відповіді</legend>
      {["1", "2", "3"].map((item, index) => (
        <div key={index} className="box_for_list1">
          <div className="box_for_answer">
            <label
              className=""
              htmlFor={`task-${props.numTask}-answer-${item}`}
            >
              Вкажіть відповідь {item}
            </label>
            <textarea
              id={`task-${props.numTask}-answer-${item}`}
              name={`task-${props.numTask}-answer-${item}`}
              onChange={(e) => handleCorrectAnswerChange(e, item)}
            ></textarea>
          </div>
        </div>
      ))}
    </fieldset>
  );
};
export default CorrectAnswerToTaskMatching;
