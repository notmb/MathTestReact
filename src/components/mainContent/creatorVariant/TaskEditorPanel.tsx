import type { ReactNode } from "react";
import type { TaskType } from "../types";
import TaskTypeSelector from "./TaskTypeSelector";

type TaskEditorPanelProps = {
  selectedTaskNumber: string | null;
  selectedTaskType: TaskType | "";
  onSelectTaskType: (taskType: TaskType) => void;
  children?: ReactNode;
};

const TaskEditorPanel = ({
  selectedTaskNumber,
  selectedTaskType,
  onSelectTaskType,
  children,
}: TaskEditorPanelProps) => {
  if (!selectedTaskNumber) {
    return <div className="creator_task">Оберіть номер завдання для редагування.</div>;
  }

  return (
    <div className="creator_task">
      <TaskTypeSelector
        id={`type-of-task-${selectedTaskNumber}`}
        value={selectedTaskType}
        onChange={onSelectTaskType}
      />
      {children ?? <p>Тут буде редактор задачі #{selectedTaskNumber}.</p>}
    </div>
  );
};

export default TaskEditorPanel;
