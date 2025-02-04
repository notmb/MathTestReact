import { useState, useRef } from "react";

import { db } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import "./addVariant.css";

interface Task1 {
  //тип даних для завдання з з вибором 1 відповіді
  task: {
    text: string;
    table?: {
      value1: string[];
      velue2: string[];
    };
    picture?: string;
    list?: string[];
  };
  answers: {
    values: string[];
    pictures?: string[];
  };
  correctAnswer: string;
  typeOfTask: string;
}
interface Tasks {
  [key: string]: Task1; // Колекція з різними завданнями
}

const AddVariant = () => {
  const [mainData, setMainData] = useState({
    variantName: "",
    num: "",
  });
  const [variant, setVariant] = useState<Tasks>();

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
    <div className="add_task">
      {!isFormData && (
        <InfaAboutVariant handleClick={handleClick}></InfaAboutVariant>
      )}
      {isFormData && (
        <CreatorNewVariant namberTask={mainData.num}></CreatorNewVariant>
      )}
    </div>
  );
};
export default AddVariant;

//ФОРМА ДЛЯ ОСНОВНОЇ ІНФОРМАЦІЇ
const InfaAboutVariant = (props: {
  handleClick: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <div className="new_variant">
      <form
        className="form_for_description_new_variant"
        onSubmit={props.handleClick}
      >
        <div className="name_new_variant">
          <label htmlFor="variantname">Ідентифікація (назва) варіанту:</label>
          <input type="text" id="variantname" name="variantName" />
        </div>
        <div className="number_of_tasks_new_variant">
          <label htmlFor="number_of_tasks">Кількість завдань:</label>
          <input type="text" id="number_of_tasks" name="numberOfTasks" />
        </div>
        <button type="submit">Далі</button>
      </form>
    </div>
  );
};
//ФОРМА ДЛЯ ОСНОВНОЇ ІНФОРМАЦІЇ

//ФОРМА ДЛЯ СТВОРЕННЯ ВАРІАНТУ
const CreatorNewVariant = (props: { namberTask: string }) => {
  const [typeTasks, setTypeTasks] = useState<string[]>(
    Array(+props.namberTask).fill("")
  );
  const items = Array.from(
    { length: +props.namberTask },
    (_, index) => index + 1
  );

  // Ref для збору даних із всіх завдань
  const formRefs = useRef<(HTMLFormElement | null)[]>([]);

  const handleSubmitAll = () => {
    formRefs.current.forEach((form, index) => {
      if (form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log(`Форма ${index + 1}:`, data);
      }
    });
  };
  // Ref для збору даних із всіх завдань

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
              <p> {item}. </p>
              <form
                onSubmit={(event) => SetTypeTask(event, item)}
                className="form_for_data_tasks"
              >
                <label htmlFor="type_of_task">Виберіть тип завдання:</label>
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
                <button>Вибрати</button>
              </form>
              {typeTasks[item - 1] === "choice" && (
                <FormIsChoice
                  numTask={item.toString()}
                  formRef={(el) => (formRefs.current[index] = el)}
                  index={index}
                ></FormIsChoice>
              )}
            </li>
          ))}
        <button type="button" onClick={handleSubmitAll}>
          Створити
        </button>
      </ul>
    </div>
  );
};
//ФОРМА ДЛЯ СТВОРЕННЯ ВАРІАНТУ

//ФОРМА ДЛЯ ЗАВДАННЯ CHOISE
const FormIsChoice = (props: {
  numTask: string;
  formRef: (el: HTMLFormElement | null) => void;
  index: number;
}) => {
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
            <button type="button" className="add_condition">
              Додати картинку
            </button>
            <button type="button" className="add_condition">
              Додати таблицю
            </button>
            <button type="button" className="add_condition">
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
                <button type="button" className="add_condition">
                  Додати картинку
                </button>
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
