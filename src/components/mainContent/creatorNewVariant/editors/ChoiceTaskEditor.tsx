import type { ChangeEvent } from "react";
import { useVariantDraftContext } from "../VariantDraftContext";
import type { ChoiceTaskDraft } from "../model/types";

type ChoiceTaskEditorProps = {
  taskDraft: ChoiceTaskDraft;
};

const DEFAULT_ANSWER_COUNT = 5;

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
  const { updateTaskDraft } = useVariantDraftContext();

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
    const file = event.currentTarget.files?.[0];
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
      if (current.type !== "choice") {
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

  const handleAnswerChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value;

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "choice") {
          return current;
        }

        const nextAnswers = [
          ...current.data.answers.values,
          ...Array.from(
            {
              length: Math.max(
                0,
                DEFAULT_ANSWER_COUNT - current.data.answers.values.length,
              ),
            },
            () => "",
          ),
        ].slice(
          0,
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
      const file = event.currentTarget.files?.[0];
      if (!file) {
        return;
      }

      const imageUrl = await readFileAsDataUrl(file);

      updateTaskDraft(taskDraft.numberTask, (current) => {
        if (current.type !== "choice") {
          return current;
        }

        const nextPictures = [
          ...(current.data.answers.pictures ?? []),
          ...Array.from(
            {
              length: Math.max(
                0,
                DEFAULT_ANSWER_COUNT -
                  (current.data.answers.pictures?.length ?? 0),
              ),
            },
            () => "",
          ),
        ].slice(
          0,
          Math.max(
            DEFAULT_ANSWER_COUNT,
            current.data.answers.pictures?.length ?? 0,
          ),
        );

        nextPictures[index] = imageUrl;

        return {
          ...current,
          files: [...current.files, file],
          data: {
            ...current.data,
            answers: {
              ...current.data.answers,
              pictures: nextPictures,
            },
          },
        };
      });

      event.currentTarget.value = "";
    };

  const handleRemoveAnswerImage = (index: number) => {
    updateTaskDraft(taskDraft.numberTask, (current) => {
      if (current.type !== "choice") {
        return current;
      }

      const nextPictures = [
        ...(current.data.answers.pictures ?? []),
        ...Array.from(
          {
            length: Math.max(
              0,
              DEFAULT_ANSWER_COUNT -
                (current.data.answers.pictures?.length ?? 0),
            ),
          },
          () => "",
        ),
      ].slice(
        0,
        Math.max(
          DEFAULT_ANSWER_COUNT,
          current.data.answers.pictures?.length ?? 0,
        ),
      );

      nextPictures[index] = "";

      return {
        ...current,
        data: {
          ...current.data,
          answers: {
            ...current.data.answers,
            pictures: nextPictures,
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

  const answerPictures = [
    ...(taskDraft.data.answers.pictures ?? []),
    ...Array.from(
      {
        length: Math.max(
          0,
          answers.length - (taskDraft.data.answers.pictures?.length ?? 0),
        ),
      },
      () => "",
    ),
  ].slice(0, answers.length);

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
            className="choice_editor__file_input"
            id={`choice-task-image-${taskDraft.numberTask}`}
            type="file"
            accept="image/*"
            onChange={handleTaskImageChange}
          />
          {taskDraft.data.task.picture && (
            <div className="choice_editor__preview_card">
              <img
                className="choice_editor__preview_image"
                src={taskDraft.data.task.picture}
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
            <div
              className="choice_editor__answer_card"
              key={`${taskDraft.numberTask}-choice-answer-${index}`}
            >
              <label
                className="choice_editor__label"
                htmlFor={`choice-answer-${taskDraft.numberTask}-${index}`}
              >
                Відповідь {index + 1}
              </label>
              <input
                className="choice_editor__input"
                id={`choice-answer-${taskDraft.numberTask}-${index}`}
                type="text"
                value={answer}
                onChange={handleAnswerChange(index)}
                placeholder={`Текст відповіді ${index + 1}`}
              />

              <label
                className="choice_editor__label"
                htmlFor={`choice-answer-image-${taskDraft.numberTask}-${index}`}
              >
                Картинка до відповіді {index + 1}
              </label>
              <input
                className="choice_editor__file_input"
                id={`choice-answer-image-${taskDraft.numberTask}-${index}`}
                type="file"
                accept="image/*"
                onChange={handleAnswerImageChange(index)}
              />

              {answerPictures[index] && (
                <div className="choice_editor__preview_card">
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
    </section>
  );
};

export default ChoiceTaskEditor;
