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
    <div className="form_for_data_tasks">
      <label htmlFor={id}>Виберіть тип завдання:</label>
      <select id={id} value={value} onChange={handleChange}>
        <option value="">Оберіть тип</option>
        <option value="choice">choice</option>
        <option value="comparison">comparison</option>
        <option value="openAnswer">openAnswer</option>
      </select>
    </div>
  );
};

export default TaskTypeSelector;
