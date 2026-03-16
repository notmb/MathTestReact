import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { useVariantContext } from "../variantContext";
import type { Task1 } from "../../types";
import type { TaskEditorComponentProps } from "./taskEditor.types";
import { saveEditedTask } from "./taskEditor.utils";
import { useTaskEditorState } from "./useTaskEditorState";

const answerMarks = ["А", "Б", "В", "Г", "Д"];

const cloneChoiceTask = (task: Task1): Task1 => ({
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
  answers: {
    values: [...task.answers.values],
    pictures: task.answers.pictures ? [...task.answers.pictures] : undefined,
  },
  correctAnswer: task.correctAnswer,
  typeOfTask: "choice",
});

const EditChoiceTask = (props: TaskEditorComponentProps<Task1>) => {
  const { updateTask } = useVariantContext();
  const [draft, updateDraft] = useImmer<Task1>(() =>
    cloneChoiceTask(props.task),
  );
  const [taskPictureFile, setTaskPictureFile] = useState<File | null>(null);
  const [answerPictureFiles, setAnswerPictureFiles] = useState<
    Record<number, File>
  >({});
  const { isSaving, error, clearError, runWithSaving } = useTaskEditorState();

  useEffect(() => {
    updateDraft(() => cloneChoiceTask(props.task));
    setTaskPictureFile(null);
    setAnswerPictureFiles({});
    clearError();
  }, [clearError, props.task, updateDraft]);

  const handleTaskTextChange = (value: string) => {
    updateDraft((current) => {
      current.task.text = value;
    });
  };

  const handleTaskPictureChange = (file: File) => {
    setTaskPictureFile(file);
    updateDraft((current) => {
      current.task.picture = file.name;
    });
  };

  const handleAnswerTextChange = (index: number, value: string) => {
    updateDraft((current) => {
      current.answers.values[index] = value;
    });
  };

  const handleAnswerPictureChange = (index: number, file: File) => {
    setAnswerPictureFiles((current) => ({
      ...current,
      [index]: file,
    }));

    updateDraft((current) => {
      if (!current.answers.pictures) {
        current.answers.pictures = Array(5).fill("");
      }
      current.answers.pictures[index] = file.name;
    });
  };

  const handleCorrectAnswerChange = (value: string) => {
    updateDraft((current) => {
      current.correctAnswer = value;
    });
  };

  const handleReset = () => {
    updateDraft(() => cloneChoiceTask(props.task));
    setTaskPictureFile(null);
    setAnswerPictureFiles({});
    clearError();
  };

  const handleSave = async () => {
    await runWithSaving(async () => {
      const newFiles: File[] = [];

      if (taskPictureFile) {
        newFiles.push(taskPictureFile);
      }
      newFiles.push(...Object.values(answerPictureFiles));

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
    <div className="creator_task">
      <form
        className="form_for_creator"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSave();
        }}
      >
        <fieldset>
          <legend>Дані для запитання</legend>
          <div className="box_for_qestion">
            <label className="set_task" htmlFor={`task-${props.numTask}`}>
              Вкажіть умову задачі
            </label>
            <textarea
              data-key="task"
              value={draft.task.text}
              id={`task-${props.numTask}`}
              name={`task-${props.numTask}`}
              onChange={(event) => {
                handleTaskTextChange(event.currentTarget.value);
              }}
            ></textarea>
          </div>

          <div className="more_conditions">
            <input
              type="file"
              accept="image/*"
              id={`task-${props.numTask}-picture`}
              name={`task-${props.numTask}-picture`}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleTaskPictureChange(file);
                }
              }}
              className="hidden"
            />

            <label
              htmlFor={`task-${props.numTask}-picture`}
              className="upload_picture"
            >
              {(taskPictureFile?.name ?? draft.task.picture)
                ? `Файл: ${taskPictureFile?.name ?? draft.task.picture}`
                : "Додати зображення"}
            </label>
          </div>
        </fieldset>

        <fieldset className="data_answers">
          <legend>Дані для варіантів відповіді</legend>
          {answerMarks.map((mark, index) => (
            <div key={mark}>
              <div className="box_for_answer">
                <label
                  className=""
                  htmlFor={`task-${props.numTask}-answer-${mark}`}
                >
                  Вкажіть відповідь {mark}
                </label>
                <textarea
                  value={draft.answers.values[index] ?? ""}
                  id={`task-${props.numTask}-answer-${mark}`}
                  name={`task-${props.numTask}-answer-${mark}`}
                  onChange={(event) => {
                    handleAnswerTextChange(index, event.currentTarget.value);
                  }}
                ></textarea>
              </div>
              <div className="more_conditions">
                <input
                  type="file"
                  accept="image/*"
                  id={`task-${props.numTask}-answer-${mark}-picture`}
                  name={`task-${props.numTask}-answer-${mark}-picture`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      handleAnswerPictureChange(index, file);
                    }
                  }}
                  className="hidden"
                />

                <label
                  htmlFor={`task-${props.numTask}-answer-${mark}-picture`}
                  className="upload_picture"
                >
                  {(answerPictureFiles[index]?.name ??
                  draft.answers.pictures?.[index])
                    ? `Файл: ${
                        answerPictureFiles[index]?.name ??
                        draft.answers.pictures?.[index]
                      }`
                    : "Додати зображення"}
                </label>
              </div>
            </div>
          ))}
        </fieldset>

        <fieldset className="data_correct_answer">
          <legend>Дані для правильної відповіді</legend>
          <label className="" htmlFor={`correct_answer-${props.numTask}`}>
            Вкажіть правильну відповідь
          </label>
          <textarea
            value={draft.correctAnswer}
            id={`correct_answer-${props.numTask}`}
            name={`correct_answer-${props.numTask}`}
            onChange={(event) => {
              handleCorrectAnswerChange(event.currentTarget.value);
            }}
          ></textarea>
        </fieldset>

        {error && <p>{error}</p>}

        <div className="buttons">
          <div className="left_side">
            <button type="submit" className="custom_button" disabled={isSaving}>
              {isSaving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
          <div className="right_side">
            <button
              type="button"
              className="custom_edit_button"
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

export default EditChoiceTask;
