import { db, storage } from "../../../firebaseConfig"; // Імпорт Firestore
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Task3 } from "./types";
import { useImmer } from "use-immer";
import ConditionOfTask from "./conditionOfTask";
import CorrectAnswerToTaskOpenAnswer from "./correctAnswerToTaskOpenAnswer";
//ФОРМА ДЛЯ ЗАВДАННЯ OPEN ANSWER
const CreatorTaskOpenAnswer = (props: {
  numSelectedTask: string;
  nameOfVariant: string;
  updateTaskIsAdded: (numTask: number, isAdded: boolean) => void;
}) => {
  const [taskData, updateTaskData] = useImmer<Task3>({
    task: {
      text: "",
    },
    correctAnswer: "",
    typeOfTask: "openAnswer",
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
        {/* Група "Дані для правильної відповіді" */}
        <CorrectAnswerToTaskOpenAnswer
          numTask={props.numSelectedTask}
          updateCorrectAnswerText={(text) => {
            updateTaskData((draft) => {
              draft.correctAnswer = text;
            });
          }}
        ></CorrectAnswerToTaskOpenAnswer>
        <button type="button" className="custom_button" onClick={handleClick}>
          Зберегти завдання
        </button>
      </form>
    </div>
  );
};
export default CreatorTaskOpenAnswer;
