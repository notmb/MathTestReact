import { useImmer } from "use-immer";
import { db } from "../../../firebaseConfig"; // Імпорт Firestore
import { doc, setDoc } from "firebase/firestore";
import { Task2 } from "./types";
import ConditionOfTask from "./conditionOfTask";
import ComparisonToMatchingTask from "./comparisonToMatchingTask";
import CorrectAnswerToTaskMatching from "./correctAnswerToTaskMatching";
//ФОРМА ДЛЯ ЗАВДАННЯ COMPARISON

const CreatorTaskMatching = (props: {
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
    correctComparison: {},
    typeOfTask: "comparison",
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
        <ComparisonToMatchingTask
          numTask={props.numTask}
          updataTaskData={updataTaskData}
        ></ComparisonToMatchingTask>
        {/* Група "Дані для співставлення" */}
        <CorrectAnswerToTaskMatching
          numTask={props.numTask}
          updataTaskData={updataTaskData}
        ></CorrectAnswerToTaskMatching>
      </form>
      <button onClick={handleClick}>see</button>
    </div>
  );
};
//ФОРМА ДЛЯ ЗАВДАННЯ COMPARISON
export default CreatorTaskMatching;
