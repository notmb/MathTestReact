const ChoosingTypeTask = (props: {
  numSelectedTask: string;
  setTypeTask: (
    numTask: number,
    event: React.FormEvent<HTMLFormElement>
  ) => void;
}) => {
  return (
    <form
      key={props.numSelectedTask}
      onSubmit={(event) => props.setTypeTask(+props.numSelectedTask, event)}
      className="form_for_data_tasks"
    >
      <label htmlFor="type_of_task">
        {props.numSelectedTask}. Виберіть тип завдання:
      </label>
      <input
        name={`typeOfTask-${props.numSelectedTask}`}
        list={`typeOfTask-${props.numSelectedTask}`}
        placeholder="type of task is..."
      />
      <datalist id={`typeOfTask-${props.numSelectedTask}`}>
        {["choice", "comparison", "openAnswer"].map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
      <button className="ml-1">Вибрати</button>
    </form>
  );
};
export default ChoosingTypeTask;
