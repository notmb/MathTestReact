import "./addVariant2.css";
import CreatorTaskChoice from "./creatorTaskChoice";
import CreatorTaskMatching from "./creatorTaskMatching";
import { useState, useRef } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Імпорт Firestore

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

interface TaskData {
  variantName: string;
  numberOfTask: string;
}

const NewVariant = () => {
  const [mainData, setMainData] = useState<TaskData | null>(null);
  const [variant, setVariant] = useState<Tasks>();

  const createVariant = async (
    variantId: string,
    name: string,
    numberTask: string
  ) => {
    try {
      const variantRef = doc(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        "Mix",
        variantId
      );
      await setDoc(variantRef, { name, numberTask });

      console.log("Тестовий варіант створено!");
    } catch (error) {
      console.error("Помилка створення:", error);
    }
  };

  const handleClickSet = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newVariantName = formData.get("variantName") as string;
    const newNum = formData.get("numberOfTasks") as string;
    const dataOfTask: TaskData = {
      variantName: newVariantName,
      numberOfTask: newNum,
    };
    setMainData(dataOfTask);
    createVariant(
      dataOfTask.variantName,
      dataOfTask.variantName,
      dataOfTask.numberOfTask
    );
  };

  return (
    <div className="add_variant">
      <InfaAboutVariant handleClickSet={handleClickSet}></InfaAboutVariant>

      {mainData && (
        <CreatorNewVariant
          namberTask={mainData.numberOfTask}
          nameVariant={mainData.variantName}
        ></CreatorNewVariant>
      )}
    </div>
  );
};
export default NewVariant;

//ФОРМА ДЛЯ ОСНОВНОЇ ІНФОРМАЦІЇ
const InfaAboutVariant = (props: {
  handleClickSet: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const [isActive, setIsActive] = useState(true);

  const deactivateWindow = () => {
    setIsActive(false); // Змінюємо висоту компонента
  };
  const activateWindow = () => {
    setIsActive(true); // Змінюємо висоту компонента
  };
  return (
    <div className="new_variant">
      <form
        className="form_for_description_new_variant"
        onSubmit={props.handleClickSet}
      >
        <div
          className={`conteiner_for_description transition-height ${
            isActive ? "max-h-40" : "max-h-8"
          }`}
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
            className={isActive ? "hidden" : "custom_button"}
            type="button"
            onClick={activateWindow}
          >
            Редагувати
          </button>
          <button
            className={isActive ? "custom_button" : "hidden"}
            type="submit"
            onClick={deactivateWindow}
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
  const [selectedTask, setSelectedTask] = useState<Number | null>(null);

  const numberTasks = Array.from(
    { length: +props.namberTask },
    (_, index) => index + 1
  );
  const handleClick = (index: number) => {
    setSelectedTask(index + 1);
  };

  const [typeTasks, setTypeTasks] = useState<string[]>(
    Array(+props.namberTask).fill(undefined)
  );
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
    console.log(typeTasks);
  };

  return (
    <div className="creator_new_variant">
      <p>Додайте хоча б одне завдання до вашого варіанту</p>
      <div className="box_for_numbers_of task">
        {numberTasks.length < 30 &&
          numberTasks.map((item, index) => (
            <div
              key={index + 1}
              className="number_of_task"
              onClick={() => handleClick(index)}
            >
              {item}
            </div>
          ))}
      </div>
      {selectedTask && (
        <CreatorTask
          nameOfVarint={props.nameVariant}
          number={selectedTask?.toString()}
          SetTypeTask={SetTypeTask}
          typeOfTasks={typeTasks}
        ></CreatorTask>
      )}
    </div>
  );
};
//ФОРМА ДЛЯ СТВОРЕННЯ ВАРІАНТУ
//ФОРМА ДЛЯ СТВОРЕННЯ ЗАВДАННЯ
const CreatorTask = (props: {
  nameOfVarint: string;
  number: string;
  SetTypeTask: (event: React.FormEvent<HTMLFormElement>, index: number) => void;
  typeOfTasks: string[];
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="creator_task">
      <form
        key={props.number}
        onSubmit={(event) => props.SetTypeTask(event, +props.number)}
        className="form_for_data_tasks"
      >
        <label htmlFor="type_of_task">
          {props.number}. Виберіть тип завдання:
        </label>
        <input
          ref={inputRef}
          name={`typeOfTask-${props.number}`}
          list={`typeOfTask-${props.number}`}
          placeholder="type of task is..."
        />
        <datalist id={`typeOfTask-${props.number}`}>
          {["choice", "comparison", "openAnswer"].map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
        <button className="ml-1">Вибрати</button>
      </form>
      {props.typeOfTasks[+props.number - 1] === "choice" && (
        <CreatorTaskChoice
          numTask={props.number}
          nameOfVariant={props.nameOfVarint}
        ></CreatorTaskChoice>
      )}
      {props.typeOfTasks[+props.number - 1] === "comparison" && (
        <CreatorTaskMatching
          numTask={props.number}
          nameOfVariant={props.nameOfVarint}
        ></CreatorTaskMatching>
      )}
    </div>
  );
};
//ФОРМА ДЛЯ СТВОРЕННЯ ЗАВДАННЯ
//ФОРМА ДЛЯ ЗАВДАННЯ CHOISER

//ФОРМА ДЛЯ ЗАВДАННЯ CHOISER
