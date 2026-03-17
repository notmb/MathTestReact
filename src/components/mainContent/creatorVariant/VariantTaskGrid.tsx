import type { DraftTaskItem } from "./VariantDraftContext";

type VariantTaskGridProps = {
  tasks: DraftTaskItem[];
  selectedTaskNumber: string | null;
  onSelectTask: (taskNumber: string) => void;
};

const VariantTaskGrid = ({
  tasks,
  selectedTaskNumber,
  onSelectTask,
}: VariantTaskGridProps) => {
  return (
    <div className="box_for_numbers_of task">
      {tasks.map((task) => {
        const isSelected = task.numberTask === selectedTaskNumber;

        return (
          <button
            key={task.numberTask}
            type="button"
            className={`number_of_task ${
              task.taskIsAdded ? "bg-green-200" : "bg-neutral-100"
            } ${isSelected ? "border-2 border-black" : "border-1 border-gray-500"}`}
            onClick={() => onSelectTask(task.numberTask)}
          >
            <p>{task.numberTask}</p>
          </button>
        );
      })}
    </div>
  );
};

export default VariantTaskGrid;
