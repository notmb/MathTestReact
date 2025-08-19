import { useImmer } from "use-immer";
import { useVariantContext } from "../tests/variantContext";
import { Task2 } from "../types";
const CorrectAnswerToTaskMatching = (props: {
  numTask: string;
  updateCorrectAwswerText: (index: string, text: string) => void;
}) => {
  const { tasks } = useVariantContext();
  const task = tasks[props.numTask] as Task2; // витягаємо потрібне завдання
  const [correctComparison, updateCorrectComparison] = useImmer(
    task?.correctComparison || {}
  );

  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    item: string
  ) => {
    const value = e.currentTarget.value;
    props.updateCorrectAwswerText(item, e.currentTarget.value);
    updateCorrectComparison((draft) => {
      draft[item] = value;
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
              value={correctComparison[item] || ""}
              onChange={(e) => handleCorrectAnswerChange(e, item)}
            ></textarea>
          </div>
        </div>
      ))}
    </fieldset>
  );
};
export default CorrectAnswerToTaskMatching;
