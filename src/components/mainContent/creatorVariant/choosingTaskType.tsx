const ChoosingTypeTask = (props: {
  number: string;
  setTypeTask: (event: React.FormEvent<HTMLFormElement>, index: number) => void;
}) => {
  return (
    <form
      key={props.number}
      onSubmit={(event) => props.setTypeTask(event, +props.number)}
      className="form_for_data_tasks"
    >
      <label htmlFor="type_of_task">
        {props.number}. Виберіть тип завдання:
      </label>
      <input
        name={`typeOfTask-${props.number}`}
        list={`typeOfTask-${props.number}`}
        placeholder="type of task is..."
      />
      <datalist id={`typeOfTask-${props.number}`}>
        {["choice", "comparison", "openAnswer"].map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
      <button className="ml-1">Вибрати</button>
    </form>
  );
};
export default ChoosingTypeTask;
