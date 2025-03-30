import { useState } from "react";
import { useImmer } from "use-immer";
import { db } from "../../../firebaseConfig"; // Імпорт Firestore
import { doc, setDoc } from "firebase/firestore";
interface Task2 {
  task: Question;
  comparisonTable: ComparisonTable;
  сorrectComparison: CorrectComparison;
  typeOfTask: string;
}
interface Question {
  text: string;
  table?: {
    value1: string[];
    velue2: string[];
  };
  picture?: string;
  list?: string[];
}
interface ComparisonTable {
  list1: {
    texts?: string[];
    pictures?: string[];
  };
  list2: {
    texts?: string[];
    picture?: string[];
  };
}
interface CorrectComparison {
  [key: string]: string;
}
//ФОРМА ДЛЯ ЗАВДАННЯ COMPARISON

const FormIsComparison = (props: {
  numTask: string;
  nameOfVariant: string;
}) => {
  const [taskData, updataTaskData] = useImmer<Task2>({
    task: {
      text: "",
    },
    comparisonTable: {
      list1: {},
      list2: {},
    },
    сorrectComparison: {},
    typeOfTask: "comparison",
  });
  const handalClick = async () => {
    console.log(taskData);
    try {
      // Створюємо посилання на документ
      const variantRef = doc(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        "Mix",
        props.nameOfVariant,
        "tasks",
        props.numTask
      );

      // Записуємо об'єкт у Firestore
      await setDoc(variantRef, taskData);

      console.log("Завдання успішно додано!");
    } catch (error) {
      console.error("Помилка при додаванні завдання:", error);
    }
  };
  const [fileTaskName, setFileTaskName] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Файл вибрано:", file.name);
      setFileTaskName(file.name);
      // setImage(file);
    } else {
      console.warn("Файл не вибрано!");
    }
  };
  const [listFileName, setListFileName] = useState<{
    [key: string]: string;
  } | null>(null);
  const handleQestoinFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputId = e.target.id;
    const file = e.target.files?.[0];
    if (file) {
      console.log("Файл вибрано:", file.name);
      listFileName
        ? setListFileName((prev) => ({
            ...prev, // копіюємо попередній стан
            [inputId]: file.name, // додаємо новий ключ або оновлюємо існуючий
          }))
        : setListFileName({ [inputId]: file.name });
      // setImage(file);
    } else {
      console.warn("Файл не вибрано!");
    }
    console.log(listFileName);
  };
  return (
    <div className="creator_task">
      <form className="form_for_creator">
        {/* Група "Дані для запитання" */}
        <fieldset>
          <legend>Дані для запитання</legend>
          <div className="box_for_qestion">
            <label className="set_task" htmlFor={`task-${props.numTask}`}>
              Вкажіть умову задачі
            </label>
            <textarea
              id={`task-${props.numTask}`}
              name={`task-${props.numTask}`}
            ></textarea>
          </div>

          <div className="more_conditions">
            <input
              type="file"
              accept="image/*"
              id={`task-${props.numTask}-picture`}
              name={`task-${props.numTask}-picture`}
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor={`task-${props.numTask}-picture`}
              className="upload_picture"
            >
              {fileTaskName ? `Файл: ${fileTaskName}` : "Додати зображення"}
            </label>

            <button type="button" className="more_condition mx-4">
              Додати таблицю
            </button>
            <button type="button" className="more_condition">
              Додати картинку
            </button>
          </div>
        </fieldset>

        {/* Група "Дані для співставлення" */}
        <fieldset className="data_for_comparison">
          <legend>Дані для співставлення</legend>
          {["1", "2", "3"].map((item, index) => (
            <div key={index} className="box_for_list1">
              <div className="box_for_answer">
                <label
                  className=""
                  htmlFor={`task-${props.numTask}-list1-${item}`}
                >
                  Вкажіть відповідь {item}
                </label>
                <textarea
                  id={`task-${props.numTask}-list1-${item}`}
                  name={`task-${props.numTask}-list1-${item}`}
                ></textarea>
              </div>
              <div className="more_conditions">
                <input
                  type="file"
                  accept="image/*"
                  id={`task-${props.numTask}-list1-${item}-picture`}
                  name={`task-${props.numTask}-list1-${item}-picture`}
                  onChange={handleQestoinFileChange}
                  className="hidden"
                />

                <label
                  htmlFor={`task-${props.numTask}-list1-${item}-picture`}
                  className="upload_picture"
                >
                  {listFileName?.[`task-${props.numTask}-list1-${item}-picture`]
                    ? `Файл: ${
                        listFileName[
                          `task-${props.numTask}-list1-${item}-picture`
                        ]
                      }`
                    : "Додати зображення"}
                </label>
              </div>
            </div>
          ))}
          {["А", "Б", "В", "Г", "Д"].map((item, index) => (
            <div key={index} className="box_for_list2">
              <div className="box_for_answer">
                <label
                  className=""
                  htmlFor={`task-${props.numTask}-list2-${item}`}
                >
                  Вкажіть відповідь {item}
                </label>
                <textarea
                  id={`task-${props.numTask}-list2-${item}`}
                  name={`task-${props.numTask}-list2-${item}`}
                ></textarea>
              </div>
              <div className="more_conditions">
                <input
                  type="file"
                  accept="image/*"
                  id={`task-${props.numTask}-list2-${item}-picture`}
                  name={`task-${props.numTask}-list2-${item}-picture`}
                  onChange={handleQestoinFileChange}
                  className="hidden"
                />

                <label
                  htmlFor={`task-${props.numTask}-list2-${item}-picture`}
                  className="upload_picture"
                >
                  {listFileName?.[`task-${props.numTask}-list2-${item}-picture`]
                    ? `Файл: ${
                        listFileName[
                          `task-${props.numTask}-list2-${item}-picture`
                        ]
                      }`
                    : "Додати зображення"}
                </label>
              </div>
            </div>
          ))}
        </fieldset>

        <fieldset className="data_correct_answer">
          <legend>Дані для правильної відповіді</legend>
          {["1", "2", "3"].map((item, index) => (
            <div key={index} className="box_for_list1">
              <div className="box_for_answer">
                <label
                  className=""
                  htmlFor={`task-${props.numTask}-answer-${item}`}
                >
                  Вкажіть відповідь {item}
                </label>
                <textarea
                  id={`task-${props.numTask}-answer-${item}`}
                  name={`task-${props.numTask}-answer-${item}`}
                ></textarea>
              </div>
            </div>
          ))}
        </fieldset>
      </form>
    </div>
  );
};
//ФОРМА ДЛЯ ЗАВДАННЯ COMPARISON
