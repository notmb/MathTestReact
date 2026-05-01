import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import type { Task3 } from "../../types";
import { useVariantContext } from "../variantContext";
import type { TaskEditorComponentProps } from "./taskEditor.types";
import { saveEditedTask } from "./taskEditor.utils";
import { useTaskEditorState } from "./useTaskEditorState";

const cloneOpenAnswerTask = (task: Task3): Task3 => ({
  task: {
    text: task.task.text,
    picture: task.task.picture,
    list: task.task.list ? [...task.task.list] : undefined,
    table: task.task.table
      ? {
          value1: [...task.task.table.value1],
          value2: [...task.task.table.value2],
        }
      : undefined,
  },
  correctAnswer: task.correctAnswer,
  typeOfTask: "openAnswer",
});

const EditOpenAnswerTask = (props: TaskEditorComponentProps<Task3>) => {
  const { updateTask } = useVariantContext();
  const [draft, updateDraft] = useImmer<Task3>(() =>
    cloneOpenAnswerTask(props.task),
  );
  const [taskPictureFile, setTaskPictureFile] = useState<File | null>(null);
  const { isSaving, error, clearError, runWithSaving } = useTaskEditorState();

  useEffect(() => {
    updateDraft(() => cloneOpenAnswerTask(props.task));
    setTaskPictureFile(null);
    clearError();
  }, [clearError, props.task, updateDraft]);

  const handleReset = () => {
    updateDraft(() => cloneOpenAnswerTask(props.task));
    setTaskPictureFile(null);
    clearError();
  };

  const handleSave = async () => {
    await runWithSaving(async () => {
      await saveEditedTask({
        draft,
        numTask: props.numTask,
        selectedVariant: props.selectedVariant,
        typeTest: props.typeTest,
        files: taskPictureFile ? [taskPictureFile] : [],
        updateTask,
        onSuccess: props.onSuccess,
      });
    });
  };

  return (
    <div className="task-editor-content">
      <form
        className="task-editor-form"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSave();
        }}
      >
        <fieldset>
          <legend>Дані для запитання</legend>
          <div className="task-prompt-field">
            <label className="task-field-label" htmlFor={`task-${props.numTask}`}>
              Вкажіть умову задачі
            </label>
            <textarea
              data-key="task"
              value={draft.task.text}
              id={`task-${props.numTask}`}
              name={`task-${props.numTask}`}
              onChange={(event) => {
                const value = event.currentTarget.value;
                updateDraft((current) => {
                  current.task.text = value;
                });
              }}
            ></textarea>
          </div>

          <div className="task-upload-row">
            <input
              type="file"
              accept="image/*"
              id={`task-${props.numTask}-picture`}
              name={`task-${props.numTask}-picture`}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setTaskPictureFile(file);
                  updateDraft((current) => {
                    current.task.picture = file.name;
                  });
                }
              }}
              className="hidden"
            />

            <label
              htmlFor={`task-${props.numTask}-picture`}
              className="task-upload-trigger"
            >
              {(taskPictureFile?.name ?? draft.task.picture)
                ? `Файл: ${taskPictureFile?.name ?? draft.task.picture}`
                : "Додати зображення"}
            </label>
          </div>
        </fieldset>

        <fieldset className="correct-answer-section">
          <legend>Дані для правильної відповіді</legend>
          <label className="" htmlFor={`correct_answer-${props.numTask}`}>
            Вкажіть правильну відповідь
          </label>
          <textarea
            value={draft.correctAnswer}
            id={`correct_answer-${props.numTask}`}
            name={`correct_answer-${props.numTask}`}
            onChange={(event) => {
              const value = event.currentTarget.value;
              updateDraft((current) => {
                current.correctAnswer = value;
              });
            }}
          ></textarea>
        </fieldset>

        {error && <p className="task-editor-error">{error}</p>}

        <div className="task-editor-actions">
          <div className="task-editor-primary-actions">
            <button
              type="button"
              className="custom-button"
              disabled={isSaving}
              onClick={() => {
                void handleSave();
              }}
            >
              {isSaving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
          <div className="task-editor-secondary-actions">
            <button
              type="button"
              className="custom-edit-button"
              onClick={handleReset}
              disabled={isSaving}
            >
              Скинути зміни
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOpenAnswerTask;
