import type { ChangeEvent } from "react";
import type { TaskType } from "../types";

type TaskTypeSelectorProps = {
  id: string;
  value: TaskType | "";
  onChange: (value: TaskType) => void;
};

const TaskTypeSelector = ({ id, value, onChange }: TaskTypeSelectorProps) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.currentTarget.value as TaskType | "";
    if (nextValue) {
      onChange(nextValue);
    }
  };

  return (
    <div className="task_type_selector">
      <label className="task_type_selector__label" htmlFor={id}>
        Тип завдання
      </label>
      <select
        className="task_type_selector__select"
        id={id}
        value={value}
        onChange={handleChange}
      >
        <option value="">Оберіть тип</option>
        <option value="choice">Вибір однієї відповіді</option>
        <option value="comparison">Співставлення</option>
        <option value="openAnswer">Відкрита відповідь</option>
      </select>
    </div>
  );
};

export default TaskTypeSelector;
