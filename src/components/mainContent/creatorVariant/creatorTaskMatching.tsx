import { useImmer } from "use-immer";
import { db, storage } from "../../../firebaseConfig"; // Імпорт Firestore
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Task2 } from "./types";
import ConditionOfTask from "./conditionOfTask";
import ComparisonToMatchingTask from "./comparisonToMatchingTask";
import CorrectAnswerToTaskMatching from "./correctAnswerToTaskMatching";
//ФОРМА ДЛЯ ЗАВДАННЯ COMPARISON

const CreatorTaskMatching = (props: {
  numSelectedTask: string;
  nameOfVariant: string;
  updateTaskIsAdded: (numTask: number, isAdded: boolean) => void;
}) => {
  const [taskData, updateTaskData] = useImmer<Task2>({
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
        <ComparisonToMatchingTask
          numTask={props.numSelectedTask}
          updateList1Text={(index, text) =>
            updateTaskData((draft) => {
              if (!draft.comparisonTable.list1.texts) {
                draft.comparisonTable.list1.texts = [];
              }
              draft.comparisonTable.list1.texts[index] = text;
            })
          }
          updateList2Text={(index, text) =>
            updateTaskData((draft) => {
              if (!draft.comparisonTable.list2.texts) {
                draft.comparisonTable.list2.texts = [];
              }
              draft.comparisonTable.list2.texts[index] = text;
            })
          }
          updateList1Pictures={(index, picture) => {
            updateTaskData((draft) => {
              if (!draft.comparisonTable.list1.pictures) {
                console.log("pictures ще не існує, створюємо масив");
                draft.comparisonTable.list1.pictures = []; // Спочатку створюємо масив
              }
              draft.comparisonTable.list1.pictures[index] = picture.name;
            });
            updateFiels((draft) => {
              draft.push(picture);
            });
          }}
          updateList2Pictures={(index, picture) => {
            updateTaskData((draft) => {
              if (!draft.comparisonTable.list2.pictures) {
                console.log("pictures ще не існує, створюємо масив");
                draft.comparisonTable.list2.pictures = []; // Спочатку створюємо масив
              }
              draft.comparisonTable.list2.pictures[index] = picture.name;
            });
            updateFiels((draft) => {
              draft.push(picture);
            });
          }}
        ></ComparisonToMatchingTask>
        {/* Група "Дані для співставлення" */}
        <CorrectAnswerToTaskMatching
          numTask={props.numSelectedTask}
          updateCorrectAwswerText={(index, text) => {
            updateTaskData((draft) => {
              draft.correctComparison[index] = text;
            });
          }}
        ></CorrectAnswerToTaskMatching>
        <button type="button" className="custom_button" onClick={handleClick}>
          Зберегти завдання
        </button>
      </form>
    </div>
  );
};
//ФОРМА ДЛЯ ЗАВДАННЯ COMPARISON
export default CreatorTaskMatching;
