import type { ChangeEvent } from "react";
import { useVariantDraftContext } from "../VariantDraftContext";
import { saveTask } from "../model/persistence";
import type { ChoiceTaskDraft } from "../model/types";
import { validateChoiceTask } from "../model/validation";
import { useAuth } from "../../../../auth/useAuth";

type ChoiceTaskEditorProps = {
  taskDraft: ChoiceTaskDraft;
};

const DEFAULT_ANSWER_COUNT = 5;
const UA_LETTERS = [
  "А",
  "Б",
  "В",
  "Г",
  "Ґ",
  "Д",
  "Е",
  "Є",
  "Ж",
  "З",
  "И",
  "І",
  "Ї",
  "Й",
  "К",
  "Л",
  "М",
  "Н",
  "О",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ф",
  "Х",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ь",
  "Ю",
  "Я",
];

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

      reject(new Error("Failed to read image file."));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read image file."));
    };

    reader.readAsDataURL(file);
  });

const ChoiceTaskEditor = ({ taskDraft }: ChoiceTaskEditorProps) => {
  const { state, setTaskItems, updateTaskDraft } = useVariantDraftContext();
  const { user, isDemo } = useAuth();

  const handleTaskTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextText = event.currentTarget.value;

    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "choice") {
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
      if (current.type !== "choice") {
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
      if (current.type !== "choice") {
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

  const handleAnswerChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "choice") {
          return current;
        }

        const nextAnswers = createFilledStringArray(
          current.data.answers.values,
          Math.max(DEFAULT_ANSWER_COUNT, current.data.answers.values.length),
        );

        nextAnswers[index] = nextValue;

        return {
          ...current,
          data: {
            ...current.data,
            answers: {
              ...current.data.answers,
              values: nextAnswers,
            },
          },
        };
      });
    };

  const handleAnswerImageChange =
    (index: number) => async (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const file = input.files?.[0];
      if (!file) {
        return;
      }

      const imageUrl = await readFileAsDataUrl(file);

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "choice") {
          return current;
        }

        const targetLength = Math.max(
          DEFAULT_ANSWER_COUNT,
          current.previewUrls.answerPictures.length,
          current.data.answers.pictures?.length ?? 0,
        );
        const nextPreviewPictures = createFilledStringArray(
          current.previewUrls.answerPictures,
          targetLength,
        );
        const nextPictureNames = createFilledStringArray(
          current.data.answers.pictures ?? [],
          targetLength,
        );

        nextPreviewPictures[index] = imageUrl;
        nextPictureNames[index] = file.name;

        return {
          ...current,
          files: [...current.files, file],
          previewUrls: {
            ...current.previewUrls,
            answerPictures: nextPreviewPictures,
          },
          data: {
            ...current.data,
            answers: {
              ...current.data.answers,
              pictures: nextPictureNames,
            },
          },
        };
      });

      input.value = "";
    };

  const handleRemoveAnswerImage = (index: number) => {
    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "choice") {
        return current;
      }

      const targetLength = Math.max(
        DEFAULT_ANSWER_COUNT,
        current.previewUrls.answerPictures.length,
        current.data.answers.pictures?.length ?? 0,
      );
      const nextPreviewPictures = createFilledStringArray(
        current.previewUrls.answerPictures,
        targetLength,
      );
      const nextPictureNames = createFilledStringArray(
        current.data.answers.pictures ?? [],
        targetLength,
      );

      nextPreviewPictures[index] = "";
      nextPictureNames[index] = "";

      return {
        ...current,
        previewUrls: {
          ...current.previewUrls,
          answerPictures: nextPreviewPictures,
        },
        data: {
          ...current.data,
          answers: {
            ...current.data.answers,
            pictures: nextPictureNames,
          },
        },
      };
    });
  };

  const handleCorrectAnswerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;

    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "choice") {
        return current;
      }

      return {
        ...current,
        data: {
          ...current.data,
          correctAnswer: nextValue,
        },
      };
    });
  };

  const answers =
    taskDraft.data.answers.values.length > 0
      ? taskDraft.data.answers.values
      : Array.from({ length: DEFAULT_ANSWER_COUNT }, () => "");

  const letterIdAnswers =
    taskDraft.data.answers.values.length > 0
      ? taskDraft.data.answers.values
      : UA_LETTERS.slice(0, DEFAULT_ANSWER_COUNT);

  const answerPictures = createFilledStringArray(
    taskDraft.previewUrls.answerPictures,
    answers.length,
  );

  const handleSaveTask = async () => {
    const validationError = validateChoiceTask(taskDraft);

    if (validationError) {
      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "choice") {
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
        if (current.type !== "choice") {
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

    if (!user) {
      alert("You need to log in to perform this action");
      return;
    }

    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "choice") {
        return current;
      }

      return {
        ...current,
        status: "saving",
        errorMessage: null,
      };
    });

    if (isDemo) {
      alert(
        "Demo mode: variant will be created only locally and will not be saved.",
      );
      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "choice") {
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
      return;
    }

    try {
      await saveTask({
        variantId: state.meta.variantId,
        typeTest: state.meta.typeTest,
        typeOfTask: "choice",
        taskNumber: taskDraft.numberTask,
        taskData: taskDraft.data,
        files: taskDraft.files,
      });

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "choice") {
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
          : "Не вдалося зберегти задачу з вибором відповіді.";

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "choice") {
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
    <section className="choice_editor">
      <div className="choice_editor__section">
        <div className="choice_editor__section_header">
          <h3>Умова задачі</h3>
          <p>Додай текст умови і, за потреби, ілюстрацію до задачі.</p>
        </div>

        <label
          className="choice_editor__label"
          htmlFor={`choice-task-text-${taskDraft.numberTask}`}
        >
          Текст умови
        </label>
        <textarea
          className="choice_editor__textarea"
          id={`choice-task-text-${taskDraft.numberTask}`}
          value={taskDraft.data.task.text}
          onChange={handleTaskTextChange}
          placeholder="Введи формулювання задачі"
        />

        <div className="choice_editor__upload">
          <label
            className="choice_editor__label"
            htmlFor={`choice-task-image-${taskDraft.numberTask}`}
          >
            Картинка до умови
          </label>
          <input
            className="choice_editor__file_input choice_editor__file_input--hidden"
            id={`choice-task-image-${taskDraft.numberTask}`}
            type="file"
            accept="image/*"
            onChange={handleTaskImageChange}
          />
          <label
            className="choice_editor__file_trigger"
            htmlFor={`choice-task-image-${taskDraft.numberTask}`}
          >
            Додати картинку
          </label>
          {taskDraft.data.task.picture && (
            <p className="choice_editor__file_name">
              {taskDraft.data.task.picture}
            </p>
          )}
          {taskDraft.previewUrls.taskPicture && (
            <div className="choice_editor__preview_card">
              <img
                className="choice_editor__preview_image"
                src={taskDraft.previewUrls.taskPicture}
                alt={`Task ${taskDraft.numberTask} illustration`}
              />
              <button
                className="choice_editor__ghost_button"
                type="button"
                onClick={handleRemoveTaskImage}
              >
                Прибрати картинку
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="choice_editor__section">
        <div className="choice_editor__section_header">
          <h3>Варіанти відповіді</h3>
          <p>Для кожної відповіді можна додати текст і окрему картинку.</p>
        </div>

        <div className="choice_editor__answers_grid">
          {answers.map((answer, index) => (
            <div key={`${taskDraft.numberTask}-choice-answer-${index}`}>
              <span className="font-semibold">
                Відповідь: {letterIdAnswers[index]}
              </span>
              <div className="choice_editor__answer_card">
                <div className="choice_editor_text">
                  <input
                    className="choice_editor__input"
                    id={`choice-answer-${taskDraft.numberTask}-${index}`}
                    type="text"
                    value={answer}
                    onChange={handleAnswerChange(index)}
                    placeholder={`Текст відповіді ${letterIdAnswers[index]}`}
                  />
                </div>

                <div className="choice_editor_picture">
                  <input
                    className="choice_editor__file_input choice_editor__file_input--hidden"
                    id={`choice-answer-image-${taskDraft.numberTask}-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={handleAnswerImageChange(index)}
                  />
                  <label
                    className="choice_editor__file_trigger"
                    htmlFor={`choice-answer-image-${taskDraft.numberTask}-${index}`}
                  >
                    <span>
                      {answerPictures[index]
                        ? "Замінити картинку"
                        : "Додати картинку"}
                    </span>
                  </label>
                  {answerPictures[index] && (
                    <div className="choice_editor__preview_card">
                      {taskDraft.data.answers.pictures?.[index] && (
                        <p className="choice_editor__file_name">
                          {taskDraft.data.answers.pictures[index]}
                        </p>
                      )}
                      <img
                        className="choice_editor__preview_image choice_editor__preview_image--answer"
                        src={answerPictures[index]}
                        alt={`Answer ${index + 1} illustration`}
                      />
                      <button
                        className="choice_editor__ghost_button"
                        type="button"
                        onClick={() => handleRemoveAnswerImage(index)}
                      >
                        Прибрати картинку
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="choice_editor__section choice_editor__section--compact">
        <div className="choice_editor__section_header">
          <h3>Правильна відповідь</h3>
          <p>Вкажи номер або текст правильної відповіді.</p>
        </div>

        <label
          className="choice_editor__label"
          htmlFor={`choice-correct-answer-${taskDraft.numberTask}`}
        >
          Правильна відповідь
        </label>
        <input
          className="choice_editor__input"
          id={`choice-correct-answer-${taskDraft.numberTask}`}
          type="text"
          value={taskDraft.data.correctAnswer}
          onChange={handleCorrectAnswerChange}
          placeholder="Наприклад: 2"
        />
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

export default ChoiceTaskEditor;
