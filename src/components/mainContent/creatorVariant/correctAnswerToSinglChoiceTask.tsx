const CorrectAnswerToSinglChoiceTask = (props: {
  numTask: string;
  updateCorrectAnswerText: (text: string) => void;
}) => {
  const handleCorrectAnswerOfTaskChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    props.updateCorrectAnswerText(e.currentTarget.value);
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
export default CorrectAnswerToSinglChoiceTask;
