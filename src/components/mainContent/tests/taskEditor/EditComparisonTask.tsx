import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import type { Task2 } from "../../types";
import { useVariantContext } from "../variantContext";
import type { TaskEditorComponentProps } from "./taskEditor.types";
import { saveEditedTask } from "./taskEditor.utils";
import { useTaskEditorState } from "./useTaskEditorState";

const list1Marks = ["1", "2", "3"];
const list2Marks = ["А", "Б", "В", "Г", "Д"];

const normalizeAnswerValue = (value: string) => value.trim().toUpperCase();
const hasComparisonRowContent = (text?: string, picture?: string) =>
  Boolean(text?.trim() || picture);

const cloneComparisonTask = (task: Task2): Task2 => ({
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
  comparisonTable: {
    list1: {
      texts: task.comparisonTable.list1.texts
        ? [...task.comparisonTable.list1.texts]
        : undefined,
      pictures: task.comparisonTable.list1.pictures
        ? [...task.comparisonTable.list1.pictures]
        : undefined,
    },
    list2: {
      texts: task.comparisonTable.list2.texts
        ? [...task.comparisonTable.list2.texts]
        : undefined,
      pictures: task.comparisonTable.list2.pictures
        ? [...task.comparisonTable.list2.pictures]
        : undefined,
    },
  },
  correctComparison: { ...task.correctComparison },
  typeOfTask: "comparison",
});

const EditComparisonTask = (props: TaskEditorComponentProps<Task2>) => {
  const { updateTask } = useVariantContext();
  const [draft, updateDraft] = useImmer<Task2>(() =>
    cloneComparisonTask(props.task),
  );
  const [taskPictureFile, setTaskPictureFile] = useState<File | null>(null);
  const [list1PictureFiles, setList1PictureFiles] = useState<
    Record<number, File>
  >({});
  const [list2PictureFiles, setList2PictureFiles] = useState<
    Record<number, File>
  >({});
  const { isSaving, error, setError, clearError, runWithSaving } =
    useTaskEditorState();

  useEffect(() => {
    updateDraft(() => cloneComparisonTask(props.task));
    setTaskPictureFile(null);
    setList1PictureFiles({});
    setList2PictureFiles({});
    clearError();
  }, [clearError, props.task, updateDraft]);

  const handleReset = () => {
    updateDraft(() => cloneComparisonTask(props.task));
    setTaskPictureFile(null);
    setList1PictureFiles({});
    setList2PictureFiles({});
    clearError();
  };

  const validateDraft = () => {
    if (!draft.task.text.trim()) {
      return "Впишіть умову завдання.";
    }

    const hasEmptyList1 = list1Marks.some(
      (_, index) =>
        !hasComparisonRowContent(
          draft.comparisonTable.list1.texts?.[index],
          draft.comparisonTable.list1.pictures?.[index],
        ),
    );

    if (hasEmptyList1) {
      return "Заповніть усі пункти першого списку.";
    }

    const hasEmptyList2 = list2Marks.some(
      (_, index) =>
        !hasComparisonRowContent(
          draft.comparisonTable.list2.texts?.[index],
          draft.comparisonTable.list2.pictures?.[index],
        ),
    );

    if (hasEmptyList2) {
      return "Заповніть усі пункти другого списку.";
    }

    const invalidCorrectAnswer = list1Marks.find((item) => {
      const value = normalizeAnswerValue(draft.correctComparison[item] ?? "");
      return !list2Marks.includes(value);
    });

    if (invalidCorrectAnswer) {
      return "Правильні відповіді мають бути лише з варіантів А, Б, В, Г, Д.";
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validateDraft();

    if (validationError) {
      setError(validationError);
      return;
    }

    await runWithSaving(async () => {
      const newFiles = [
        ...(taskPictureFile ? [taskPictureFile] : []),
        ...Object.values(list1PictureFiles),
        ...Object.values(list2PictureFiles),
      ];

      await saveEditedTask({
        draft,
        numTask: props.numTask,
        selectedVariant: props.selectedVariant,
        typeTest: props.typeTest,
        files: newFiles,
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

        <fieldset className="comparison-section">
          <legend>Дані для співставлення</legend>
          {list1Marks.map((item, index) => (
            <div key={item} className="comparison-left-item task-editor-card">
              <div className="task-answer-field">
                <label
                  className=""
                  htmlFor={`task-${props.numTask}-list1-${item}`}
                >
                  Вкажіть відповідь {item}
                </label>
                <textarea
                  id={`task-${props.numTask}-list1-${item}`}
                  name={`task-${props.numTask}-list1-${item}`}
                  value={draft.comparisonTable.list1.texts?.[index] ?? ""}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    updateDraft((current) => {
                      if (!current.comparisonTable.list1.texts) {
                        current.comparisonTable.list1.texts = [];
                      }
                      current.comparisonTable.list1.texts[index] = value;
                    });
                  }}
                ></textarea>
              </div>
              <div className="task-upload-row">
                <input
                  type="file"
                  accept="image/*"
                  id={`task-${props.numTask}-list1-${item}-picture`}
                  name={`task-${props.numTask}-list1-${item}-picture`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setList1PictureFiles((current) => ({
                        ...current,
                        [index]: file,
                      }));

                      updateDraft((current) => {
                        if (!current.comparisonTable.list1.pictures) {
                          current.comparisonTable.list1.pictures = [];
                        }
                        current.comparisonTable.list1.pictures[index] =
                          file.name;
                      });
                    }
                  }}
                  className="hidden"
                />

                <label
                  htmlFor={`task-${props.numTask}-list1-${item}-picture`}
                  className="task-upload-trigger"
                >
                  {(list1PictureFiles[index]?.name ??
                  draft.comparisonTable.list1.pictures?.[index])
                    ? `Файл: ${
                        list1PictureFiles[index]?.name ??
                        draft.comparisonTable.list1.pictures?.[index]
                      }`
                    : "Додати зображення"}
                </label>
              </div>
            </div>
          ))}

          {list2Marks.map((item, index) => (
            <div key={item} className="comparison-right-item task-editor-card">
              <div className="task-answer-field">
                <label
                  className=""
                  htmlFor={`task-${props.numTask}-list2-${item}`}
                >
                  Вкажіть відповідь {item}
                </label>
                <textarea
                  id={`task-${props.numTask}-list2-${item}`}
                  name={`task-${props.numTask}-list2-${item}`}
                  value={draft.comparisonTable.list2.texts?.[index] ?? ""}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    updateDraft((current) => {
                      if (!current.comparisonTable.list2.texts) {
                        current.comparisonTable.list2.texts = [];
                      }
                      current.comparisonTable.list2.texts[index] = value;
                    });
                  }}
                ></textarea>
              </div>
              <div className="task-upload-row">
                <input
                  type="file"
                  accept="image/*"
                  id={`task-${props.numTask}-list2-${item}-picture`}
                  name={`task-${props.numTask}-list2-${item}-picture`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setList2PictureFiles((current) => ({
                        ...current,
                        [index]: file,
                      }));

                      updateDraft((current) => {
                        if (!current.comparisonTable.list2.pictures) {
                          current.comparisonTable.list2.pictures = [];
                        }
                        current.comparisonTable.list2.pictures[index] =
                          file.name;
                      });
                    }
                  }}
                  className="hidden"
                />

                <label
                  htmlFor={`task-${props.numTask}-list2-${item}-picture`}
                  className="task-upload-trigger"
                >
                  {(list2PictureFiles[index]?.name ??
                  draft.comparisonTable.list2.pictures?.[index])
                    ? `Файл: ${
                        list2PictureFiles[index]?.name ??
                        draft.comparisonTable.list2.pictures?.[index]
                      }`
                    : "Додати зображення"}
                </label>
              </div>
            </div>
          ))}
        </fieldset>

        <fieldset className="correct-answer-section">
          <legend>Дані для правильної відповіді</legend>
          {list1Marks.map((item) => (
            <div key={item} className="comparison-match-item task-editor-card">
              <div className="task-answer-field">
                <label
                  className=""
                  htmlFor={`task-${props.numTask}-answer-${item}`}
                >
                  Вкажіть відповідь {item}
                </label>
                <textarea
                  id={`task-${props.numTask}-answer-${item}`}
                  name={`task-${props.numTask}-answer-${item}`}
                  value={draft.correctComparison[item] ?? ""}
                  onChange={(event) => {
                    const value = normalizeAnswerValue(
                      event.currentTarget.value,
                    );
                    updateDraft((current) => {
                      current.correctComparison[item] = value;
                    });
                  }}
                ></textarea>
              </div>
            </div>
          ))}
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

export default EditComparisonTask;
