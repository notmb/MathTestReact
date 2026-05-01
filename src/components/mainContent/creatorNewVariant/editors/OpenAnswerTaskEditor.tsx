import type { ChangeEvent } from "react";
import { useVariantDraftContext } from "../VariantDraftContext";
import { saveTask } from "../model/persistence";
import type { OpenAnswerTaskDraft } from "../model/types";
import { validateOpenAnswerTask } from "../model/validation";
import { useAuth } from "../../../../auth/useAuth";

type OpenAnswerTaskEditorProps = {
  taskDraft: OpenAnswerTaskDraft;
};

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

const OpenAnswerTaskEditor = ({ taskDraft }: OpenAnswerTaskEditorProps) => {
  const { state, setTaskItems, updateTaskDraft } = useVariantDraftContext();
  const { user, isDemo } = useAuth();

  const handleTaskTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextText = event.currentTarget.value;

    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "openAnswer") {
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
      if (current.type !== "openAnswer") {
        return current;
      }

      return {
        ...current,
        files: [...current.files, file],
        previewUrls: {
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
      if (current.type !== "openAnswer") {
        return current;
      }

      return {
        ...current,
        previewUrls: {
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

  const handleCorrectAnswerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;

    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "openAnswer") {
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

  const handleSaveTask = async () => {
    const validationError = validateOpenAnswerTask(taskDraft);

    if (validationError) {
      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "openAnswer") {
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
        if (current.type !== "openAnswer") {
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
      if (current.type !== "openAnswer") {
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
        if (current.type !== "openAnswer") {
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
        typeOfTask: "openAnswer",
        taskNumber: taskDraft.numberTask,
        taskData: taskDraft.data,
        files: taskDraft.files,
      });

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "openAnswer") {
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
          : "Не вдалося зберегти задачу з відкритою відповіддю.";

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "openAnswer") {
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
    <section className="open_answer_editor">
      <div className="open_answer_editor__section">
        <div className="open_answer_editor__section_header">
          <h3>Умова завдання</h3>
          <p>
            Додай текст завдання і, за потреби, зображення, яке допоможе
            сформулювати умову.
          </p>
        </div>

        <label
          className="open_answer_editor__label"
          htmlFor={`open-answer-task-text-${taskDraft.numberTask}`}
        >
          Текст умови
        </label>
        <textarea
          className="open_answer_editor__textarea"
          id={`open-answer-task-text-${taskDraft.numberTask}`}
          value={taskDraft.data.task.text}
          onChange={handleTaskTextChange}
          placeholder="Введи формулювання задачі"
        />

        <div className="open_answer_editor__upload">
          <label
            className="open_answer_editor__label"
            htmlFor={`open-answer-task-image-${taskDraft.numberTask}`}
          >
            Зображення до умови
          </label>
          <input
            className="open_answer_editor__file_input open_answer_editor__file_input--hidden"
            id={`open-answer-task-image-${taskDraft.numberTask}`}
            type="file"
            accept="image/*"
            onChange={handleTaskImageChange}
          />
          <label
            className="open_answer_editor__file_trigger"
            htmlFor={`open-answer-task-image-${taskDraft.numberTask}`}
          >
            <span>
              {taskDraft.data.task.picture
                ? "Замінити картинку"
                : "Додати картинку"}
            </span>
          </label>
          {taskDraft.data.task.picture && (
            <p className="open_answer_editor__file_name">
              {taskDraft.data.task.picture}
            </p>
          )}
          {taskDraft.previewUrls.taskPicture && (
            <div className="open_answer_editor__preview_card">
              <img
                className="open_answer_editor__preview_image"
                src={taskDraft.previewUrls.taskPicture}
                alt={`Ілюстрація до завдання ${taskDraft.numberTask}`}
              />
              <button
                className="open_answer_editor__ghost_button"
                type="button"
                onClick={handleRemoveTaskImage}
              >
                Прибрати зображення
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="open_answer_editor__section open_answer_editor__section--compact">
        <div className="open_answer_editor__section_header">
          <h3>Правильна відповідь</h3>
          <p>
            Вкажи значення або короткий текст, який вважається правильною
            відповіддю.
          </p>
        </div>

        <label
          className="open_answer_editor__label"
          htmlFor={`open-answer-correct-${taskDraft.numberTask}`}
        >
          Правильна відповідь
        </label>
        <input
          className="open_answer_editor__input"
          id={`open-answer-correct-${taskDraft.numberTask}`}
          type="text"
          value={taskDraft.data.correctAnswer}
          onChange={handleCorrectAnswerChange}
          placeholder="Наприклад: 12 або x = 4"
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

export default OpenAnswerTaskEditor;
