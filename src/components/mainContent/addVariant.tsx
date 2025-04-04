import { useState, useRef } from "react";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { storage, db } from "../../firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";

import "./addVariant.css";

interface Task1 {
  //тип даних для завдання з з вибором 1 відповіді
  task: Question;
  answers: Answers;
  correctAnswer: string;
  typeOfTask: string;
}
interface Task2 {
  //тип даних для завдання співставлення
  task: Question;
  comparisonTable: ComparisonTable;
  сorrectComparison: CorrectComparison;
  typeOfTask: string;
}
interface Task3 {
  //тип даних для завдання з відкритою відповіддю
  task: Question;
  correctAnswer: string;
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
interface Answers {
  values: string[];
  pictures?: string[];
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
interface Tasks {
  // Колекція з різними завданнями
  [key: string]: Task1 | Task2 | Task3;
}

const AddVariant = () => {
  const [mainData, setMainData] = useState({
    variantName: "",
    num: "",
  });

  const [isFormData, setIsFormData] = useState<boolean>(false);

  const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newVariantName = formData.get("variantName") as string;
    const newNum = formData.get("numberOfTasks") as string;
    setMainData((prev) => ({
      ...prev,
      variantName: newVariantName,
      num: newNum,
    }));
    setIsFormData(true);
  };

  console.log(mainData);
  return (
    <div className="add_variant">
      <InfaAboutVariant
        handleClick={handleClick}
        isFormData={isFormData}
      ></InfaAboutVariant>
      {isFormData && (
        <CreatorNewVariant
          namberTask={mainData.num}
          nameVariant={mainData.variantName}
        ></CreatorNewVariant>
      )}
    </div>
  );
};
export default AddVariant;

//ФОРМА ДЛЯ ОСНОВНОЇ ІНФОРМАЦІЇ
const InfaAboutVariant = (props: {
  handleClick: (event: React.FormEvent<HTMLFormElement>) => void;
  isFormData: boolean;
}) => {
  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    setIsActive(!isActive); // Перемикаємо клас
  };
  return (
    <div className="new_variant">
      <form
        className="form_for_description_new_variant"
        onSubmit={props.handleClick}
      >
        <div
          className={
            isActive
              ? "conteiner_for_description h-8"
              : "conteiner_for_description "
          }
        >
          <div className="name_new_variant">
            <label htmlFor="variantname">Ідентифікація (назва) варіанту:</label>
            <input type="text" id="variantname" name="variantName" />
          </div>
          <div className="number_of_tasks_new_variant">
            <label htmlFor="number_of_tasks">Кількість завдань:</label>
            <input type="text" id="number_of_tasks" name="numberOfTasks" />
          </div>
        </div>
        <div>
          <button
            className={isActive ? "custom_button" : "hidden"}
            type="button"
            onClick={handleClick}
          >
            Редагувати
          </button>
          <button
            className={isActive ? "hidden" : "custom_button"}
            type="submit"
            onClick={handleClick}
          >
            Ок
          </button>
        </div>
      </form>
    </div>
  );
};
//ФОРМА ДЛЯ ОСНОВНОЇ ІНФОРМАЦІЇ

//ФОРМА ДЛЯ СТВОРЕННЯ ВАРІАНТУ
const CreatorNewVariant = (props: {
  namberTask: string;
  nameVariant: string;
}) => {
  const items = Array.from(
    { length: +props.namberTask },
    (_, index) => index + 1
  );

  const [typeTasks, setTypeTasks] = useState<string[]>(
    Array(+props.namberTask).fill("")
  );

  // Ref для збору даних із всіх завдань
  const formRefs = useRef<(HTMLFormElement | null)[]>([]);

  const [variant, setVariant] = useState<Tasks>();

  const uploadFile = async (file: File) => {
    try {
      if (!file || !file.name) {
        console.error("Invalid file:", file);
        return;
      }
      console.log("Uploading file:", file.name);

      const fileRef = ref(storage, `${props.nameVariant}/${file.name}`);
      await uploadBytes(fileRef, file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmitAll = async () => {
    const allTasks: Tasks = {}; // Масив для збереження всіх завдань

    for (const [index, form] of formRefs.current.entries()) {
      if (!form) continue;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const taskFile = formData.get(`task-${index + 1}-picture`) as File; // Оголошуємо змінну file

      if (typeTasks[index] === "choice") {
        const answerFiles = [
          formData.get(`task-${index + 1}-answer-А-picture`),
          formData.get(`task-${index + 1}-answer-Б-picture`),
          formData.get(`task-${index + 1}-answer-В-picture`),
          formData.get(`task-${index + 1}-answer-Г-picture`),
          formData.get(`task-${index + 1}-answer-Д-picture`),
        ] as File[];

        // .filter((file): file is File => file instanceof File); // Фільтруємо тільки файли

        // Завантажуємо файли в Firebase Storage

        if (taskFile) await uploadFile(taskFile);
        if (
          answerFiles[0] &&
          answerFiles[1] &&
          answerFiles[2] &&
          answerFiles[3] &&
          answerFiles[4]
        )
          await Promise.all(answerFiles.map(uploadFile));

        // await Promise.all(answerFiles.map((file) => uploadFile(file))); `task-${props.numTask}-answer-${item}-picture`

        allTasks[index + 1] = {
          task: {
            text: data[`task-${index + 1}`] as string, // Доступ до значення поля завдання
            ...(taskFile instanceof File && taskFile.name
              ? { picture: taskFile.name }
              : {}),
          },
          answers: {
            values: [
              data[`task-${index + 1}-answer-А`] as string,
              data[`task-${index + 1}-answer-Б`] as string,
              data[`task-${index + 1}-answer-В`] as string,
              data[`task-${index + 1}-answer-Г`] as string,
              data[`task-${index + 1}-answer-Д`] as string,
            ],
            ...(answerFiles[0] instanceof File &&
            answerFiles[0].name &&
            answerFiles[1] instanceof File &&
            answerFiles[1].name &&
            answerFiles[2] instanceof File &&
            answerFiles[2].name &&
            answerFiles[3] instanceof File &&
            answerFiles[3].name &&
            answerFiles[4] instanceof File &&
            answerFiles[4].name
              ? {
                  pictures: [
                    answerFiles[0].name,
                    answerFiles[1].name,
                    answerFiles[2].name,
                    answerFiles[3].name,
                    answerFiles[4].name,
                  ],
                }
              : {}),
          },
          correctAnswer: data[`correct_answer-${index + 1}`] as string,
          typeOfTask: "choice" as string,
        };
      }

      if (typeTasks[index] === "openAnswer") {
        allTasks[index + 1] = {
          task: {
            text: data[`task-${index + 1}`] as string, // Доступ до значення поля завдання
          },
          correctAnswer: data[`correct_answer-${index + 1}`] as string,
          typeOfTask: "openAnswer" as string,
        };
      }

      if (typeTasks[index] === "comparison") {
        allTasks[index + 1] = {
          task: {
            text: data[`task-${index + 1}`] as string, // Доступ до значення поля завдання
            ...(taskFile instanceof File && taskFile.name
              ? { picture: taskFile.name }
              : {}),
          },
          comparisonTable: {
            list1: {
              texts: [
                data[`task-${index + 1}-list1-1`],
                data[`task-${index + 1}-list1-2`],
                data[`task-${index + 1}-list1-3`],
              ] as string[],
            },
            list2: {
              texts: [
                data[`task-${index + 1}-list2-А`],
                data[`task-${index + 1}-list2-Б`],
                data[`task-${index + 1}-list2-В`],
                data[`task-${index + 1}-list2-Г`],
                data[`task-${index + 1}-list2-Д`],
              ] as string[],
            },
          },
          сorrectComparison: {
            ["1"]: data[`task-${index + 1}-answer-1`] as string,
            ["2"]: data[`task-${index + 1}-answer-2`] as string,
            ["3"]: data[`task-${index + 1}-answer-3`] as string,
          },
          typeOfTask: "comparison" as string,
        };
      }

      // allTasks[index + 1] = oneTask; // Додаємо завдання до масиву
    }

    setVariant(allTasks);
    console.log(allTasks);
  };
  // Ref для збору даних із всіх завдань

  const addVariant = async (nameVariant: string) => {
    const userDocRef = doc(db, "topic 1", nameVariant);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      console.log("Документ з таким ID вже існує.");
      const userInput = window.prompt("Введіть ваше ім'я:", "Ім'я");
      if (userInput !== null) {
        console.log("Користувач ввів:", userInput);
      } else {
        console.log("Користувач скасував ввід");
      }
    } else {
      await setDoc(userDocRef, variant);
      console.log("Документ успішно створено з ID:", nameVariant);
    }
    console.log(variant);
    console.log(typeTasks);
  };

  //встановлюємо тип завдання
  const SetTypeTask = (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputValue = formData.get(`typeOfTask-${index}`);
    setTypeTasks((prev) => {
      const newTasks = [...prev]; // Копіюємо масив
      newTasks[index - 1] = inputValue as string; // Змінюємо значення конкретного елемента
      return newTasks; // Повертаємо новий масив
    });
  };
  //встановлюємо тип завдання

  return (
    <div className="creator_new_variant">
      <ul className="list_tasks">
        {items.length < 30 &&
          items.map((item, index) => (
            <li key={index} className="list_item">
              <form
                onSubmit={(event) => SetTypeTask(event, item)}
                className="form_for_data_tasks"
              >
                <label htmlFor="type_of_task">
                  {item}. Виберіть тип завдання:
                </label>
                <input
                  name={`typeOfTask-${item}`}
                  list={`typeOfTask-${item}`}
                  placeholder="your answer..."
                />
                <datalist id={`typeOfTask-${item}`}>
                  {["choice", "comparison", "openAnswer"].map(
                    (option, index) => (
                      <option key={index} value={option} />
                    )
                  )}
                </datalist>
                <button className="ml-1">Вибрати</button>
              </form>
              {typeTasks[item - 1] === "choice" && (
                <FormIsChoice
                  numTask={item.toString()}
                  formRef={(el) => (formRefs.current[index] = el)}
                ></FormIsChoice>
              )}
              {typeTasks[item - 1] === "openAnswer" && (
                <FormIsOpenAnswer
                  numTask={item.toString()}
                  formRef={(el) => (formRefs.current[index] = el)}
                ></FormIsOpenAnswer>
              )}
              {typeTasks[item - 1] === "comparison" && (
                <FormIsComparison
                  numTask={item.toString()}
                  formRef={(el) => (formRefs.current[index] = el)}
                  index={index}
                ></FormIsComparison>
              )}
            </li>
          ))}
        <div className="saveAndCreate_button">
          <button type="button" onClick={handleSubmitAll}>
            Створити
          </button>

          <button type="button" onClick={() => addVariant(props.nameVariant)}>
            Зберегти
          </button>
        </div>
      </ul>
    </div>
  );
};
//ФОРМА ДЛЯ СТВОРЕННЯ ВАРІАНТУ

//ФОРМА ДЛЯ ЗАВДАННЯ CHOISE
const FormIsChoice = (props: {
  numTask: string;
  formRef: (el: HTMLFormElement | null) => void;
}) => {
  // const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [image, setImage] = useState<File | null>(null);
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
  const [qestoinFileName, setQestoinFileName] = useState<{
    [key: string]: string;
  } | null>(null);
  const handleQestoinFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputId = e.target.id;
    const file = e.target.files?.[0];
    if (file) {
      console.log("Файл вибрано:", file.name);
      qestoinFileName
        ? setQestoinFileName((prev) => ({
            ...prev, // копіюємо попередній стан
            [inputId]: file.name, // додаємо новий ключ або оновлюємо існуючий
          }))
        : setQestoinFileName({ [inputId]: file.name });
      // setImage(file);
    } else {
      console.warn("Файл не вибрано!");
    }
    console.log(qestoinFileName);
  };

  return (
    <div className="creator_task">
      <form className="form_for_creator" ref={props.formRef}>
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

        {/* Група "Дані для варіантів відповіді" */}
        <fieldset className="data_answers">
          <legend>Дані для варіантів відповіді</legend>
          {["А", "Б", "В", "Г", "Д"].map((item, index) => (
            <div key={index}>
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
              <div className="more_conditions">
                <input
                  type="file"
                  accept="image/*"
                  id={`task-${props.numTask}-answer-${item}-picture`}
                  name={`task-${props.numTask}-answer-${item}-picture`}
                  onChange={handleQestoinFileChange}
                  className="hidden"
                />

                <label
                  htmlFor={`task-${props.numTask}-answer-${item}-picture`}
                  className="upload_picture"
                >
                  {qestoinFileName?.[
                    `task-${props.numTask}-answer-${item}-picture`
                  ]
                    ? `Файл: ${
                        qestoinFileName[
                          `task-${props.numTask}-answer-${item}-picture`
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
          <label className="" htmlFor={`correct_answer-${props.numTask}`}>
            Вкажіть правильну відповідь
          </label>
          <textarea
            id={`correct_answer-${props.numTask}`}
            name={`correct_answer-${props.numTask}`}
          ></textarea>
        </fieldset>
      </form>
    </div>
  );
};
//ФОРМА ДЛЯ ЗАВДАННЯ CHOISE

//ФОРМА ДЛЯ ЗАВДАННЯ OPEN ANSWER
const FormIsOpenAnswer = (props: {
  numTask: string;
  formRef: (el: HTMLFormElement | null) => void;
}) => {
  // const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Файл вибрано:", file.name);
      setFileName(file.name);
      // setImage(file);
    } else {
      console.warn("Файл не вибрано!");
    }
  };
  return (
    <div className="creator_task">
      <form className="form_for_creator" ref={props.formRef}>
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
              id="fileInput"
              onChange={handleFileChange}
              className="hidden"
            />

            <label htmlFor="fileInput" className="upload_picture">
              {fileName ? `Файл: ${fileName}` : "Додати зображення"}
            </label>
            <button type="button" className="more_condition mx-4">
              Додати таблицю
            </button>
            <button type="button" className="more_condition">
              Додати картинку
            </button>
          </div>
        </fieldset>

        <fieldset className="data_correct_answer">
          <legend>Дані для правильної відповіді</legend>
          <label className="" htmlFor={`correct_answer-${props.numTask}`}>
            Вкажіть правильну відповідь
          </label>
          <textarea
            id={`correct_answer-${props.numTask}`}
            name={`correct_answer-${props.numTask}`}
          ></textarea>
        </fieldset>
      </form>
    </div>
  );
};
//ФОРМА ДЛЯ ЗАВДАННЯ OPEN ANSWER

//ФОРМА ДЛЯ ЗАВДАННЯ COMPARISON
const FormIsComparison = (props: {
  numTask: string;
  formRef: (el: HTMLFormElement | null) => void;
  index: number;
}) => {
  // const [image, setImage] = useState<File | null>(null);
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
      <form className="form_for_creator" ref={props.formRef}>
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
