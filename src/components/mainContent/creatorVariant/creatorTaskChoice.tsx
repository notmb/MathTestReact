import { useState } from "react";
import { db } from "../../../firebaseConfig"; // Імпорт Firestore
import { doc, setDoc } from "firebase/firestore";
import { useImmer } from "use-immer";
import ConditionOfTask from "./conditionOfTask";
import AnswersToSinglChoiceTask from "./answersToSingleChoiceTask";
interface Task1 {
  //тип даних для завдання з з вибором 1 відповіді
  task: Question;
  answers: Answers;
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
        <button type="button" className="custom_button" onClick={handalClick}>
          Зберегти завдання
        </button>
      </form>
    </div>
  );
};
//ФОРМА ДЛЯ ЗАВДАННЯ CHOISE

export default CreatorTaskChoice;
