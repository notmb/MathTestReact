import { db } from "../../../firebaseConfig"; // Імпорт Firestore
import { doc, setDoc } from "firebase/firestore";
import { useImmer } from "use-immer";
import { Task1 } from "./types";
import ConditionOfTask from "./conditionOfTask";
import AnswersToSinglChoiceTask from "./answersToSingleChoiceTask";
import CorrectAnswerToSinglChoiceTask from "./correctAnswerToSinglChoiceTask";

const CreatorTaskChoice = (props: {
  numTask: string;
  nameOfVariant: string;
}) => {
  const [taskData, updataTaskData] = useImmer<Task1>({
    task: {
      text: "",
    },
    answers: {
      values: [],
    },
    correctAnswer: "",
    typeOfTask: "choice",
  });

  const handleClick = async () => {
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

  return (
    <div className="creator_task">
      <form className="form_for_creator">
        {/* Група "Дані для запитання" */}
        <ConditionOfTask
          numTask={props.numTask}
          updataTaskData={updataTaskData}
        ></ConditionOfTask>
        {/* Група "Дані для варіантів відповіді" */}
        <AnswersToSinglChoiceTask
          numTask={props.numTask}
          updataTaskData={updataTaskData}
        ></AnswersToSinglChoiceTask>
        {/* Група "Дані для правильної відповіді" */}
        <CorrectAnswerToSinglChoiceTask
          numTask={props.numTask}
          updataTaskData={updataTaskData}
        ></CorrectAnswerToSinglChoiceTask>
        <button type="button" className="custom_button" onClick={handleClick}>
          Зберегти завдання
        </button>
      </form>
    </div>
  );
};
//ФОРМА ДЛЯ ЗАВДАННЯ CHOISE

export default CreatorTaskChoice;
