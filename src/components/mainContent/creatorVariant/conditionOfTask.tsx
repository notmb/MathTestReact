import { useState } from "react";
import { useVariantContext } from "../../../context/variantContext";

const ConditionOfTask = (props: {
  numTask: string;
  updateTaskText: (text: string) => void;
  updateTaskPicture: (picture: File) => void;
}) => {
  const [nameFileTask, setNameFileTask] = useState<string | null>(null);
  const { tasks } = useVariantContext();
  const task = tasks[props.numTask]; // витягаємо потрібне завдання
  const [condition, setCondition] = useState(task?.task.text || "");
  const handleTextOfTaskChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    props.updateTaskText(e.currentTarget.value);
    setCondition(e.currentTarget.value);
  };

  const handleTaskFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Файл вибрано:", file.name);
      setNameFileTask(file.name);
      props.updateTaskPicture(file);
    } else {
      console.warn("Файл не вибрано!");
    }
  };
  return (
    <fieldset>
      <legend>Дані для запитання</legend>
      <div className="box_for_qestion">
        <label className="set_task" htmlFor={`task-${props.numTask}`}>
          Вкажіть умову задачі
        </label>
        <textarea
          data-key="task"
          value={condition || ""}
          id={`task-${props.numTask}`}
          name={`task-${props.numTask}`}
          onChange={handleTextOfTaskChange}
        ></textarea>
      </div>

      <div className="more_conditions">
        <input
          type="file"
          accept="image/*"
          id={`task-${props.numTask}-picture`}
          name={`task-${props.numTask}-picture`}
          onChange={handleTaskFileChange}
          className="hidden"
        />

        <label
          htmlFor={`task-${props.numTask}-picture`}
          className="upload_picture"
        >
          {nameFileTask ? `Файл: ${nameFileTask}` : "Додати зображення"}
        </label>

        {/* <button type="button" className="more_condition mx-4">
          Додати таблицю
        </button>
        <button type="button" className="more_condition">
          Додати картинку
        </button> */}
      </div>
    </fieldset>
  );
};
export default ConditionOfTask;
