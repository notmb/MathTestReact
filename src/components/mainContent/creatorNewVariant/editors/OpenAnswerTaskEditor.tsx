import type { ChangeEvent } from "react";
import { useVariantDraftContext } from "../VariantDraftContext";
import type { OpenAnswerTaskDraft } from "../model/types";

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
      reject(reader.error ?? new Error("Не вдалося прочитати файл зображення."));
    };

    reader.readAsDataURL(file);
  });

const OpenAnswerTaskEditor = ({ taskDraft }: OpenAnswerTaskEditorProps) => {
  const { updateTaskDraft } = useVariantDraftContext();

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
    const file = event.currentTarget.files?.[0];
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
        data: {
          ...current.data,
          task: {
            ...current.data.task,
            picture: imageUrl,
          },
        },
      };
    });

    event.currentTarget.value = "";
  };

  const handleRemoveTaskImage = () => {
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
            className="open_answer_editor__file_input"
            id={`open-answer-task-image-${taskDraft.numberTask}`}
            type="file"
            accept="image/*"
            onChange={handleTaskImageChange}
          />
          {taskDraft.data.task.picture && (
            <div className="open_answer_editor__preview_card">
              <img
                className="open_answer_editor__preview_image"
                src={taskDraft.data.task.picture}
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
          <p>Вкажи значення або короткий текст, який вважається правильною відповіддю.</p>
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
    </section>
  );
};

export default OpenAnswerTaskEditor;
