import "./tests.css";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  getDoc,
  doc,
  collection,
  getCountFromServer,
} from "firebase/firestore";
import TestsItem from "./testItem";

interface Answers {
  value: string[];
  pictures: string[];
}
interface Comparison {
  list1: string[];
  list2: string[];
}
interface TaskData {
  task: string[];
  answers: Answers;
  correctAnswer: string;
  typeOfTask: string;
  comparisonTable: Comparison;
  correctComparison: string[];
}
interface TestItem {
  [key: string]: TaskData; // Колекція з різними завданнями
}

const Tests = () => {
  const [document, setDocument] = useState<TestItem>();

  //ГЕНЕРУЄМО ТЕСТ

  const getDocument = async () => {
    try {
      const docRef = doc(db, "topic 1", "variant 1"); // Створюємо посилання на документ
      const docSnap = await getDoc(docRef); // Отримуємо дані документа

      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<TestItem>;
        const finalData: TestItem = Object.entries(data).reduce(
          (acc, [key, taskData]) => {
            acc[key] = {
              task: taskData?.task ?? ["Немає завдання"],
              answers: taskData?.answers ?? { value: [], pictures: [] },
              correctAnswer: taskData?.correctAnswer ?? "Немає відповіді",
              typeOfTask: taskData?.typeOfTask ?? "unknown",
              comparisonTable: taskData?.comparisonTable ?? {
                list1: [],
                list2: [],
              },
              correctComparison: taskData?.correctComparison ?? [],
            };
            console.log(acc[key].task);

            return acc;
          },
          {} as TestItem
        );
        setDocument(finalData);
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  };
  useEffect(() => {
    getDocument();
  }, []);

  //ГЕНЕРУЄМО ТЕСТ
  return (
    <div>
      <div className="tests">
        {document &&
          Object.entries(document).map(([key, task]) => (
            <div key={key}>
              <TestsItem
                task={task.task}
                answers={task.answers}
                typeOfTask={task.typeOfTask}
                comparisonTable={task.comparisonTable}
                number={key}
              />
            </div>
          ))}
        {!document && <p>Loading...</p>}
        <button>Перевірити</button>
      </div>
    </div>
  );
};

export default Tests;
