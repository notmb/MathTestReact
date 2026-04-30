import type { ChangeEvent } from "react";
import { useVariantDraftContext } from "../VariantDraftContext";
import { saveTask } from "../model/persistence";
import type { ComparisonTaskDraft } from "../model/types";
import { validateComparisonTask } from "../model/validation";

type ComparisonTaskEditorProps = {
  taskDraft: ComparisonTaskDraft;
};

const LEFT_ITEM_COUNT = 3;
const RIGHT_ITEM_COUNT = 5;
const RIGHT_OPTION_LABELS = ["А", "Б", "В", "Г", "Д"] as const;

const createFilledStringArray = (
  currentValues: string[],
  targetLength: number,
) =>
  [
    ...currentValues,
    ...Array.from(
      { length: Math.max(0, targetLength - currentValues.length) },
      () => "",
    ),
  ].slice(0, targetLength);

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Не вдалося прочитати файл зображення."));
    };

    reader.onerror = () => {
      reject(
        reader.error ?? new Error("Не вдалося прочитати файл зображення."),
      );
    };

    reader.readAsDataURL(file);
  });

const ComparisonTaskEditor = ({ taskDraft }: ComparisonTaskEditorProps) => {
  const { state, setTaskItems, updateTaskDraft } = useVariantDraftContext();

  const handleTaskTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextText = event.currentTarget.value;

    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "comparison") {
        return current;
      }

      return {
        ...current,
        data: {
          ...current.data,
          task: {
            ...current.data.task,
            text: nextText,
          },
        },
      };
    });
  };

  const handleTaskImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const imageUrl = await readFileAsDataUrl(file);

    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "comparison") {
        return current;
      }

      return {
        ...current,
        files: [...current.files, file],
        previewUrls: {
          ...current.previewUrls,
          taskPicture: imageUrl,
        },
        data: {
          ...current.data,
          task: {
            ...current.data.task,
            picture: file.name,
          },
        },
      };
    });

    input.value = "";
  };

  const handleRemoveTaskImage = () => {
    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "comparison") {
        return current;
      }

      return {
        ...current,
        previewUrls: {
          ...current.previewUrls,
          taskPicture: "",
        },
        data: {
          ...current.data,
          task: {
            ...current.data.task,
            picture: "",
          },
        },
      };
    });
  };

  const handleListTextChange =
    (listKey: "list1" | "list2", index: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "comparison") {
          return current;
        }

        const currentTexts = current.data.comparisonTable[listKey].texts ?? [];
        const targetLength =
          listKey === "list1" ? LEFT_ITEM_COUNT : RIGHT_ITEM_COUNT;
        const nextTexts = createFilledStringArray(currentTexts, targetLength);
        nextTexts[index] = nextValue;

        return {
          ...current,
          data: {
            ...current.data,
            comparisonTable: {
              ...current.data.comparisonTable,
              [listKey]: {
                ...current.data.comparisonTable[listKey],
                texts: nextTexts,
              },
            },
          },
        };
      });
    };

  const handleListImageChange =
    (listKey: "list1" | "list2", index: number) =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const file = input.files?.[0];
      if (!file) {
        return;
      }

      const imageUrl = await readFileAsDataUrl(file);

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "comparison") {
          return current;
        }

        const targetLength =
          listKey === "list1" ? LEFT_ITEM_COUNT : RIGHT_ITEM_COUNT;
        const previewKey =
          listKey === "list1" ? "list1Pictures" : "list2Pictures";
        const nextPreviewPictures = createFilledStringArray(
          current.previewUrls[previewKey],
          targetLength,
        );
        const nextPictureNames = createFilledStringArray(
          current.data.comparisonTable[listKey].pictures ?? [],
          targetLength,
        );

        nextPreviewPictures[index] = imageUrl;
        nextPictureNames[index] = file.name;

        return {
          ...current,
          files: [...current.files, file],
          previewUrls: {
            ...current.previewUrls,
            [previewKey]: nextPreviewPictures,
          },
          data: {
            ...current.data,
            comparisonTable: {
              ...current.data.comparisonTable,
              [listKey]: {
                ...current.data.comparisonTable[listKey],
                pictures: nextPictureNames,
              },
            },
          },
        };
      });

      input.value = "";
    };

  const handleRemoveListImage = (listKey: "list1" | "list2", index: number) => {
    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "comparison") {
        return current;
      }

      const targetLength =
        listKey === "list1" ? LEFT_ITEM_COUNT : RIGHT_ITEM_COUNT;
      const previewKey =
        listKey === "list1" ? "list1Pictures" : "list2Pictures";
      const nextPreviewPictures = createFilledStringArray(
        current.previewUrls[previewKey],
        targetLength,
      );
      const nextPictureNames = createFilledStringArray(
        current.data.comparisonTable[listKey].pictures ?? [],
        targetLength,
      );

      nextPreviewPictures[index] = "";
      nextPictureNames[index] = "";

      return {
        ...current,
        previewUrls: {
          ...current.previewUrls,
          [previewKey]: nextPreviewPictures,
        },
        data: {
          ...current.data,
          comparisonTable: {
            ...current.data.comparisonTable,
            [listKey]: {
              ...current.data.comparisonTable[listKey],
              pictures: nextPictureNames,
            },
          },
        },
      };
    });
  };

  const handleCorrectComparisonChange =
    (key: string) => (event: ChangeEvent<HTMLSelectElement>) => {
      const nextValue = event.currentTarget.value;

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "comparison") {
          return current;
        }

        return {
          ...current,
          data: {
            ...current.data,
            correctComparison: {
              ...current.data.correctComparison,
              [key]: nextValue,
            },
          },
        };
      });
    };

  const list1Texts = createFilledStringArray(
    taskDraft.data.comparisonTable.list1.texts ?? [],
    LEFT_ITEM_COUNT,
  );
  const list2Texts = createFilledStringArray(
    taskDraft.data.comparisonTable.list2.texts ?? [],
    RIGHT_ITEM_COUNT,
  );
  const list1Pictures = createFilledStringArray(
    taskDraft.previewUrls.list1Pictures,
    LEFT_ITEM_COUNT,
  );
  const list2Pictures = createFilledStringArray(
    taskDraft.previewUrls.list2Pictures,
    RIGHT_ITEM_COUNT,
  );

  const handleSaveTask = async () => {
    const validationError = validateComparisonTask(taskDraft);

    if (validationError) {
      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "comparison") {
          return current;
        }

        return {
          ...current,
          status: "error",
          errorMessage: validationError,
        };
      });
      return;
    }

    if (!state.meta.variantId) {
      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "comparison") {
          return current;
        }

        return {
          ...current,
          status: "error",
          errorMessage: "Спочатку створи варіант, а потім зберігай задачі.",
        };
      });
      return;
    }

    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "comparison") {
        return current;
      }

      return {
        ...current,
        status: "saving",
        errorMessage: null,
      };
    });

    try {
      await saveTask({
        variantId: state.meta.variantId,
        typeTest: state.meta.typeTest,
        typeOfTask: "comparison",
        taskNumber: taskDraft.numberTask,
        taskData: taskDraft.data,
        files: taskDraft.files,
      });

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "comparison") {
          return current;
        }

        return {
          ...current,
          status: "saved",
          errorMessage: null,
        };
      });

      setTaskItems(
        state.taskItems.map((item) =>
          item.numberTask === taskDraft.numberTask
            ? { ...item, taskIsAdded: true }
            : item,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Не вдалося зберегти задачу на співставлення.";

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "comparison") {
          return current;
        }

        return {
          ...current,
          status: "error",
          errorMessage: message,
        };
      });
    }
  };

  return (
    <section className="comparison_editor">
      <div className="comparison_editor__section">
        <div className="comparison_editor__section_header">
          <h3>Умова завдання</h3>
          <p>
            Додай основний текст завдання і, за потреби, зображення до нього.
          </p>
        </div>

        <label
          className="comparison_editor__label"
          htmlFor={`comparison-task-text-${taskDraft.numberTask}`}
        >
          Текст умови
        </label>
        <textarea
          className="comparison_editor__textarea"
          id={`comparison-task-text-${taskDraft.numberTask}`}
          value={taskDraft.data.task.text}
          onChange={handleTaskTextChange}
          placeholder="Опиши, що саме потрібно співставити"
        />

        <div className="comparison_editor__upload">
          <label
            className="comparison_editor__label"
            htmlFor={`comparison-task-image-${taskDraft.numberTask}`}
          ></label>
          <input
            className="comparison_editor__file_input comparison_editor__file_input--hidden"
            id={`comparison-task-image-${taskDraft.numberTask}`}
            type="file"
            accept="image/*"
            onChange={handleTaskImageChange}
          />
          <label
            className="comparison_editor__file_trigger"
            htmlFor={`comparison-task-image-${taskDraft.numberTask}`}
          >
            <span>
              {taskDraft.data.task.picture
                ? "Замінити картинку"
                : "Додати картинку"}
            </span>
          </label>
          {taskDraft.data.task.picture && (
            <p className="comparison_editor__file_name">
              {taskDraft.data.task.picture}
            </p>
          )}
          {taskDraft.previewUrls.taskPicture && (
            <div className="comparison_editor__preview_card">
              <img
                className="comparison_editor__preview_image"
                src={taskDraft.previewUrls.taskPicture}
                alt={`Ілюстрація до завдання ${taskDraft.numberTask}`}
              />
              <button
                className="comparison_editor__ghost_button"
                type="button"
                onClick={handleRemoveTaskImage}
              >
                Прибрати зображення
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="comparison_editor__section">
        <div className="comparison_editor__section_header">
          <h3>Елементи для співставлення</h3>
          <p>
            Заповни обидва списки. Кожен елемент може містити текст, зображення
            або обидва варіанти.
          </p>
        </div>

        <div className="comparison_editor__columns">
          <div className="comparison_editor__column">
            <h4 className="comparison_editor__column_title">Лівий список</h4>
            {list1Texts.map((value, index) => (
              <div
                className="comparison_editor__item_card"
                key={`${taskDraft.numberTask}-comparison-left-${index}`}
              >
                <span className="comparison_editor__item_mark">
                  {index + 1}
                </span>
                <div className="comparison_editor__item_fields">
                  <label
                    className="comparison_editor__label"
                    htmlFor={`comparison-left-${taskDraft.numberTask}-${index}`}
                  >
                    Елемент {index + 1}
                  </label>
                  <input
                    className="comparison_editor__input"
                    id={`comparison-left-${taskDraft.numberTask}-${index}`}
                    type="text"
                    value={value}
                    onChange={handleListTextChange("list1", index)}
                    placeholder={`Текст для елемента ${index + 1}`}
                  />

                  <label
                    className="comparison_editor__label"
                    htmlFor={`comparison-left-image-${taskDraft.numberTask}-${index}`}
                  >
                    {/* Зображення для елемента {index + 1} */}
                  </label>
                  <input
                    className="comparison_editor__file_input comparison_editor__file_input--hidden"
                    id={`comparison-left-image-${taskDraft.numberTask}-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={handleListImageChange("list1", index)}
                  />
                  <label
                    className="comparison_editor__file_trigger"
                    htmlFor={`comparison-left-image-${taskDraft.numberTask}-${index}`}
                  >
                    <span>
                      {list1Pictures[index]
                        ? "Замінити картинку"
                        : "Додати картинку"}
                    </span>
                  </label>
                  {taskDraft.data.comparisonTable.list1.pictures?.[index] && (
                    <p className="comparison_editor__file_name">
                      {taskDraft.data.comparisonTable.list1.pictures[index]}
                    </p>
                  )}

                  {list1Pictures[index] && (
                    <div className="comparison_editor__preview_card">
                      <img
                        className="comparison_editor__preview_image comparison_editor__preview_image--item"
                        src={list1Pictures[index]}
                        alt={`Ілюстрація для елемента ${index + 1}`}
                      />
                      <button
                        className="comparison_editor__ghost_button"
                        type="button"
                        onClick={() => handleRemoveListImage("list1", index)}
                      >
                        Прибрати зображення
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="comparison_editor__column">
            <h4 className="comparison_editor__column_title">Правий список</h4>
            {list2Texts.map((value, index) => (
              <div
                className="comparison_editor__item_card"
                key={`${taskDraft.numberTask}-comparison-right-${index}`}
              >
                <span className="comparison_editor__item_mark">
                  {RIGHT_OPTION_LABELS[index]}
                </span>
                <div className="comparison_editor__item_fields">
                  <label
                    className="comparison_editor__label"
                    htmlFor={`comparison-right-${taskDraft.numberTask}-${index}`}
                  >
                    Елемент {RIGHT_OPTION_LABELS[index]}
                  </label>
                  <input
                    className="comparison_editor__input"
                    id={`comparison-right-${taskDraft.numberTask}-${index}`}
                    type="text"
                    value={value}
                    onChange={handleListTextChange("list2", index)}
                    placeholder={`Текст для елемента ${RIGHT_OPTION_LABELS[index]}`}
                  />

                  <label
                    className="comparison_editor__label"
                    htmlFor={`comparison-right-image-${taskDraft.numberTask}-${index}`}
                  >
                    {/* Зображення для елемента {RIGHT_OPTION_LABELS[index]} */}
                  </label>
                  <input
                    className="comparison_editor__file_input comparison_editor__file_input--hidden"
                    id={`comparison-right-image-${taskDraft.numberTask}-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={handleListImageChange("list2", index)}
                  />
                  <label
                    className="comparison_editor__file_trigger"
                    htmlFor={`comparison-right-image-${taskDraft.numberTask}-${index}`}
                  >
                    <span>
                      {list2Pictures[index]
                        ? "Замінити картинку"
                        : "Додати картинку"}
                    </span>
                  </label>
                  {taskDraft.data.comparisonTable.list2.pictures?.[index] && (
                    <p className="comparison_editor__file_name">
                      {taskDraft.data.comparisonTable.list2.pictures[index]}
                    </p>
                  )}

                  {list2Pictures[index] && (
                    <div className="comparison_editor__preview_card">
                      <img
                        className="comparison_editor__preview_image comparison_editor__preview_image--item"
                        src={list2Pictures[index]}
                        alt={`Ілюстрація для елемента ${RIGHT_OPTION_LABELS[index]}`}
                      />
                      <button
                        className="comparison_editor__ghost_button"
                        type="button"
                        onClick={() => handleRemoveListImage("list2", index)}
                      >
                        Прибрати зображення
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="comparison_editor__section comparison_editor__section--compact">
        <div className="comparison_editor__section_header">
          <h3>Правильні відповідності</h3>
          <p>
            Вибери, який елемент правого списку відповідає кожному елементу
            лівого списку.
          </p>
        </div>

        <div className="comparison_editor__mapping_grid">
          {Array.from({ length: LEFT_ITEM_COUNT }, (_, index) => {
            const key = String(index + 1);

            return (
              <div
                className="comparison_editor__mapping_row"
                key={`${taskDraft.numberTask}-comparison-map-${key}`}
              >
                <label
                  className="comparison_editor__label"
                  htmlFor={`comparison-correct-${key}-${taskDraft.numberTask}`}
                >
                  Для {key}
                </label>
                <select
                  className="comparison_editor__select"
                  id={`comparison-correct-${key}-${taskDraft.numberTask}`}
                  value={taskDraft.data.correctComparison[key] ?? ""}
                  onChange={handleCorrectComparisonChange(key)}
                >
                  <option value="">Оберіть елемент</option>
                  {RIGHT_OPTION_LABELS.map((label, optionIndex) => (
                    <option key={label} value={label}>
                      {label}
                      {list2Texts[optionIndex]
                        ? ` - ${list2Texts[optionIndex]}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      <div className="creator_task_save_actions">
        <button
          className="creator_task_save_button"
          type="button"
          onClick={handleSaveTask}
          disabled={taskDraft.status === "saving"}
        >
          {taskDraft.status === "saving" ? "Збереження..." : "Зберегти задачу"}
        </button>
      </div>
      {taskDraft.errorMessage && (
        <p className="creator_task_save_feedback creator_task_save_feedback--error">
          {taskDraft.errorMessage}
        </p>
      )}
      {taskDraft.status === "saved" && !taskDraft.errorMessage && (
        <p className="creator_task_save_feedback creator_task_save_feedback--success">
          Задачу збережено.
        </p>
      )}
    </section>
  );
};

export default ComparisonTaskEditor;
