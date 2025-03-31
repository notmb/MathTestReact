import { db } from "../../../firebaseConfig"; // Імпорт Firestore
import { doc, setDoc } from "firebase/firestore";
import { Task3 } from "./types";
import { useImmer } from "use-immer";
import ConditionOfTask from "./conditionOfTask";
import CorrectAnswerToTaskOpenAnswer from "./correctAnswerToTaskOpenAnswer";
//ФОРМА ДЛЯ ЗАВДАННЯ OPEN ANSWER
const CreatorTaskOpenAnswer = (props: {
  numTask: string;
  nameOfVariant: string;
}) => {
  const [taskData, updataTaskData] = useImmer<Task3>({
    task: {
      text: "",
    },
    correctAnswer: "",
    typeOfTask: "openAnswer",
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
        {/* Група "Дані для правильної відповіді" */}
        <CorrectAnswerToTaskOpenAnswer
          numTask={props.numTask}
          updataTaskData={updataTaskData}
        ></CorrectAnswerToTaskOpenAnswer>
        <button type="button" className="custom_button" onClick={handleClick}>
          Зберегти завдання
        </button>
      </form>
    </div>
  );
};
export default CreatorTaskOpenAnswer;
