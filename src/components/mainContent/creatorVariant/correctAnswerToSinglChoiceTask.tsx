import { useVariantContext } from "../../../context/variantContext";
import { Task1 } from "../types";
import { useState } from "react";
const CorrectAnswerToSinglChoiceTask = (props: {
  numTask: string;
  updateCorrectAnswerText: (text: string) => void;
}) => {
  const { tasks } = useVariantContext();
  const task = tasks[props.numTask] as Task1; // витягаємо потрібне завдання
  const [correctAnswer, setCorrectAnswer] = useState(task?.correctAnswer || "");

  const handleCorrectAnswerOfTaskChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.currentTarget.value;
    setCorrectAnswer(value);
    props.updateCorrectAnswerText(value);
  };

  return (
    <fieldset className="data_correct_answer">
      <legend>Дані для правильної відповіді</legend>
      <label className="" htmlFor={`correct_answer-${props.numTask}`}>
        Вкажіть правильну відповідь
      </label>
      <textarea
        value={correctAnswer}
        id={`correct_answer-${props.numTask}`}
        name={`correct_answer-${props.numTask}`}
        onChange={handleCorrectAnswerOfTaskChange}
      ></textarea>
    </fieldset>
  );
};
export default CorrectAnswerToSinglChoiceTask;
