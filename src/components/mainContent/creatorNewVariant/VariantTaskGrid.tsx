import type { TaskItemDraft } from "./model/types";

type VariantTaskGridProps = {
  tasks: TaskItemDraft[];
  selectedTaskNumber: string | null;
  onSelectTask: (taskNumber: string) => void;
};

const VariantTaskGrid = ({
  tasks,
  selectedTaskNumber,
  onSelectTask,
}: VariantTaskGridProps) => {
  return (
    <section className="variant_task_grid">
      <div className="variant_task_grid__header">
        <div>
          <p className="variant_task_grid__eyebrow">Крок 2</p>
          <h2 className="variant_task_grid__title">
            Оберіть завдання для редагування
          </h2>
        </div>

        <div className="variant_task_grid__legend">
          <span className="variant_task_grid__legend_item">
            <span className="variant_task_grid__legend_dot variant_task_grid__legend_dot--empty" />
            Чернетка
          </span>
          <span className="variant_task_grid__legend_item">
            <span className="variant_task_grid__legend_dot variant_task_grid__legend_dot--ready" />
            Додано
          </span>
        </div>
      </div>

      <div className="variant_task_grid__items">
        {tasks.map((task) => {
          const isSelected = task.numberTask === selectedTaskNumber;
          const itemClasses = [
            "variant_task_grid__item",
            task.taskIsAdded
              ? "variant_task_grid__item--ready"
              : "variant_task_grid__item--draft",
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
                {task.taskIsAdded ? "Готово" : "Чернетка"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default VariantTaskGrid;
