import type {
  TaskDraftStatus,
  TaskItemDraft,
  TaskMapDraft,
} from "./model/types";

type VariantTaskGridProps = {
  tasks: TaskItemDraft[];
  taskDrafts: TaskMapDraft;
  selectedTaskNumber: string | null;
  onSelectTask: (taskNumber: string) => void;
};

const getTaskStatusMeta = (status: TaskDraftStatus) => {
  // функція, перетворює статус задачі на дані для UI.
  switch (status) {
    case "empty":
      return {
        itemClassName: "variant_task_grid__item--empty",
        label: "Порожня",
      };
    case "draft":
      return {
        itemClassName: "variant_task_grid__item--draft",
        label: "Чернетка",
      };
    case "saving":
      return {
        itemClassName: "variant_task_grid__item--saving",
        label: "Збереження",
      };
    case "saved":
      return {
        itemClassName: "variant_task_grid__item--saved",
        label: "Збережено",
      };
    case "error":
      return {
        itemClassName: "variant_task_grid__item--error",
        label: "Помилка",
      };
  }
};

const VariantTaskGrid = ({
  tasks,
  taskDrafts,
  selectedTaskNumber,
  onSelectTask,
}: VariantTaskGridProps) => {
  return (
    <section className="variant_task_grid">
      <div className="variant_task_grid__header">
        <div>
          <p className="variant_task_grid__eyebrow">Крок 2</p>
          <h2 className="variant_task_grid__title">Оберіть завдання</h2>
        </div>

        <div className="variant_task_grid__legend">
          <span className="variant_task_grid__legend_item">
            <span className="variant_task_grid__legend_dot variant_task_grid__legend_dot--empty" />
            Порожня
          </span>
          <span className="variant_task_grid__legend_item">
            <span className="variant_task_grid__legend_dot variant_task_grid__legend_dot--draft" />
            Чернетка
          </span>
          <span className="variant_task_grid__legend_item">
            <span className="variant_task_grid__legend_dot variant_task_grid__legend_dot--saving" />
            Збереження
          </span>
          <span className="variant_task_grid__legend_item">
            <span className="variant_task_grid__legend_dot variant_task_grid__legend_dot--saved" />
            Збережено
          </span>
          <span className="variant_task_grid__legend_item">
            <span className="variant_task_grid__legend_dot variant_task_grid__legend_dot--error" />
            Помилка
          </span>
        </div>
      </div>

      <div className="variant_task_grid__items">
        {tasks.map((task) => {
          const taskStatus = taskDrafts[task.numberTask]?.status ?? "empty";
          const statusMeta = getTaskStatusMeta(taskStatus);
          const isSelected = task.numberTask === selectedTaskNumber;
          const itemClasses = [
            "variant_task_grid__item",
            statusMeta.itemClassName,
            isSelected ? "variant_task_grid__item--selected" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={task.numberTask}
              type="button"
              className={itemClasses}
              onClick={() => onSelectTask(task.numberTask)}
            >
              <span className="variant_task_grid__item_number">
                {task.numberTask}
              </span>
              <span className="variant_task_grid__item_status">
                {statusMeta.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default VariantTaskGrid;
