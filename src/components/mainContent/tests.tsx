import { db } from "../../firebaseConfig";
import {
  getDoc,
  doc,
  collection,
  getCountFromServer,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import "./tests.css";
import TestsItem from "./testsItem";

interface Test {
  question: string;
  answers: string[];
  correctAnswer: string;
  imgForAnswers: string[];
  imgForQuestion: string;
}

const Tests = () => {
  const [documents, setDocuments] = useState<Test[]>([]);

  //ГЕНЕРУЄМО ТЕСТ
  useEffect(() => {
    const fetchMultipleDocuments = async () => {
      try {
        // Отримання кількості документів
        const coll = collection(db, "tasks");
        const snapshot = await getCountFromServer(coll);
        const count = snapshot.data().count;

        const tasksId = randomNumber(2, count); // Генерація ідентифікаторів
        console.log(tasksId);
        const promises = tasksId.map((id) => getDoc(doc(db, "tasks", id)));
        const documentSnapshots = await Promise.all(promises);

        const documents: Test[] = documentSnapshots.map((snapshot) => {
          if (snapshot.exists()) {
            // Приводимо дані документа до типу Test
            return snapshot.data() as Test;
          } else {
            throw new Error("Документ не існує");
          }
        });

        setDocuments(documents); // Зберігаємо отримані документи в стані
      } catch (error) {
        console.error("Помилка отримання документів:", error);
      }
    };

    fetchMultipleDocuments(); // Викликаємо логіку отримання документів при першому рендері
  }, []);

  console.log("Отримані документи:", documents);
  //ГЕНЕРУЄМО ТЕСТ

  //ВМІСТ КОМПОНЕНТА
  if (!documents) {
    return <div>Loading...</div>;
  }

  return (
    <div className="alltests">
      {documents.map((item, index) => (
        <div key={index} className="tests">
          <TestsItem testItem={item}></TestsItem>
          cdsdsfsd <br></br>
          kombo father
        </div>
      ))}
    </div>
  );
};

export default Tests;
//ВМІСТ КОМПОНЕНТА

//ГЕНЕРУЄМО ВИПАДКОВІ ЧИСЛА ДЛЯ ТЕСТУ
const randomNumber = (numberOfTask: number, CountAllTask: number): string[] => {
  const m: { [key: number]: number } = {};
  const a: string[] = [];

  for (let i: number = 0; i < numberOfTask; ++i) {
    const r: number = Math.floor(Math.random() * (CountAllTask - i));
    a.push(((r in m ? m[r] : r) + 1).toString());
    const l: number = CountAllTask - i - 1;
    m[r] = l in m ? m[l] : l;
  }

  return a;
};
//ГЕНЕРУЄМО ВИПАДКОВІ ЧИСЛА ДЛЯ ТЕСТУ
