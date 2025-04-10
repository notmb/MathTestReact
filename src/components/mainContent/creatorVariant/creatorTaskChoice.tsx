import { db, storage } from "../../../firebaseConfig"; // Імпорт Firestore
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useImmer } from "use-immer";
import { Task1 } from "./types";
import ConditionOfTask from "./conditionOfTask";
import AnswersToSinglChoiceTask from "./answersToSingleChoiceTask";
import CorrectAnswerToSinglChoiceTask from "./correctAnswerToSinglChoiceTask";

const CreatorTaskChoice = (props: {
  numSelectedTask: string;
  nameOfVariant: string;
  updateTaskIsAdded: (numTask: number, isAdded: boolean) => void;
}) => {
  const [taskData, updateTaskData] = useImmer<Task1>({
    task: {
      text: "",
    },
    answers: {
      values: [],
    },
    correctAnswer: "",
    typeOfTask: "choice",
  });
  const [files, updateFiels] = useImmer<File[]>([]);

  const uploadFile = async (file: File) => {
    try {
      if (!file || !file.name) {
        console.error("Invalid file:", file);
        return;
      }
      console.log("Uploading file:", file.name);

      const fileRef = ref(storage, `${props.nameOfVariant}/${file.name}`);
      await uploadBytes(fileRef, file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

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
        props.numSelectedTask
      );

      // Записуємо об'єкт у Firestore
      await setDoc(variantRef, taskData);

      console.log("Завдання успішно додано!");
    } catch (error) {
      console.error("Помилка при додаванні завдання:", error);
    }
    if (files.length > 0) await Promise.all(files.map(uploadFile));
    props.updateTaskIsAdded(+props.numSelectedTask - 1, true);
  };

  return (
    <div className="creator_task">
      <form className="form_for_creator">
        {/* Група "Дані для запитання" */}
        <ConditionOfTask
          numTask={props.numSelectedTask}
          updateTaskText={(text) => {
            updateTaskData((draft) => {
              draft.task.text = text;
            });
          }}
          updateTaskPicture={(picture) => {
            updateTaskData((draft) => {
              draft.task.picture = picture.name;
            });
            updateFiels((draft) => {
              draft.push(picture);
            });
          }}
        ></ConditionOfTask>
        {/* Група "Дані для варіантів відповіді" */}
        <AnswersToSinglChoiceTask
          numTask={props.numSelectedTask}
          updateAnswerText={(index, text) => {
            updateTaskData((draft) => {
              draft.answers.values[index] = text;
            });
          }}
          updateAnswerPictures={(index, picture) => {
            updateTaskData((draft) => {
              if (!draft.answers.pictures) {
                console.log("pictures ще не існує, створюємо масив");
                draft.answers.pictures = []; // Спочатку створюємо масив
              }
              draft.answers.pictures[index] = picture.name;
            });
            updateFiels((draft) => {
              draft.push(picture);
            });
          }}
        ></AnswersToSinglChoiceTask>
        {/* Група "Дані для правильної відповіді" */}
        <CorrectAnswerToSinglChoiceTask
          numTask={props.numSelectedTask}
          updateCorrectAnswerText={(text) => {
            updateTaskData((draft) => {
              draft.correctAnswer = text;
            });
          }}
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
