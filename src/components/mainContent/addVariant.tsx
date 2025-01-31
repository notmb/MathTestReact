import { useState } from "react";
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

const AddVariant = () => {
  const [formData, setFormData] = useState({
    variantName: "",
    num: "",
  });
  const [isFormData, setIsFormData] = useState<boolean>(false);

  const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newVariantName = formData.get("variantName") as string;
    const newNum = formData.get("numberOfTasks") as string;

    setFormData((prev) => ({
      ...prev,
      variantName: newVariantName,
      num: newNum,
    }));

    setIsFormData(true);
  };

  console.log(formData);
  return (
    <div className="add_task">
      {!isFormData && (
        <InfaAboutVariant handleClick={handleClick}></InfaAboutVariant>
      )}
      {isFormData && (
        <CreatorNewVariant namberTask={formData.num}></CreatorNewVariant>
      )}
    </div>
  );
};
export default AddVariant;

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

const CreatorNewVariant = (props: { namberTask: string }) => {
  const [typeTasks, setTypeTasks] = useState<boolean[]>(
    Array(+props.namberTask).fill(false)
  );
  const items = Array.from(
    { length: +props.namberTask },
    (_, index) => index + 1
  );

  const handleClick = (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    event.preventDefault();

    setTypeTasks((prev) => {
      const newTasks = [...prev]; // Копіюємо масив
      newTasks[index] = true; // Змінюємо значення конкретного елемента
      return newTasks; // Повертаємо новий масив
    });
  };

  console.log(items); // Перевірка правильності масиву
  return (
    <div className="creator_new_variant">
      <ul>
        {items.length < 30 &&
          items.map((item, index) => (
            <li key={index} className="list_item">
              <p> {item}. </p>
              <form
                onSubmit={(event) => handleClick(event, item)}
                className="form_for_data_tasks"
              >
                <label htmlFor="type_of_task">Виберіть тип завдання:</label>
                <input
                  id="type_of_task"
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
              {typeTasks[item] && (
                <FormIsChoice numTask={item.toString()}></FormIsChoice>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

const FormIsChoice = (props: { numTask: string }) => {
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  return (
    <div className="data_task">
      <div>
        <form className="form_for_task">
          <label className="set_task" htmlFor={`task-${props.numTask}`}>
            Вкажіть умову задачі
          </label>
          <textarea id={`task-${props.numTask}`}></textarea>
          <div className="more_conditions">
            {" "}
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
        </form>
      </div>
      <div className="data_answers">
        <form className="set_answers">
          <div>
            <div className="box_for_answer">
              <label className="" htmlFor={`answer-A-${props.numTask}`}>
                Вкажіть відповідь А
              </label>
              <textarea id={`answer-A-${props.numTask}`}></textarea>
            </div>
            <button>Додати картинку</button>
          </div>

          <div>
            <div className="box_for_answer">
              <label className="" htmlFor={`answer-B-${props.numTask}`}>
                Вкажіть відповідь Б
              </label>
              <textarea id={`answer-B-${props.numTask}`}></textarea>
            </div>
            <button>Додати картинку</button>
          </div>

          <div>
            <div className="box_for_answer">
              <label className="" htmlFor={`answer-B-${props.numTask}`}>
                Вкажіть відповідь В
              </label>
              <textarea id={`answer-B-${props.numTask}`}></textarea>
            </div>
            <button>Додати картинку</button>
          </div>
          <div>
            <div className="box_for_answer">
              <label className="" htmlFor={`answer-B-${props.numTask}`}>
                Вкажіть відповідь Г
              </label>
              <textarea id={`answer-B-${props.numTask}`}></textarea>
            </div>
            <button>Додати картинку</button>
          </div>
          <div>
            <div className="box_for_answer">
              <label className="" htmlFor={`answer-B-${props.numTask}`}>
                Вкажіть відповідь Д
              </label>
              <textarea id={`answer-B-${props.numTask}`}></textarea>
            </div>
            <button>Додати картинку</button>
          </div>
        </form>
      </div>
      <div className="data_correct_answer">
        <label className="" htmlFor={`correct_answer-${props.numTask}`}>
          Вкажіть правильну відповідь
        </label>
        <textarea id={`correct_answer-${props.numTask}`}></textarea>
      </div>
    </div>
  );
};
