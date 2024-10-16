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

const Tests = () => {
  const [documents, setDocuments] = useState<any[]>([]);

  // Отримання кількості документів
  // const getDocumentCount = async () => {
  //   try {
  //     const coll = collection(db, "tasks");
  //     const snapshot = await getCountFromServer(coll);
  //     const count = snapshot.data().count
  //   } catch (error) {
  //     console.error("Помилка отримання кількості документів:", error);
  //   }
  // };

  // Викликаємо getDocumentCount тільки один раз при завантаженні
  // useEffect(() => {
  //   getDocumentCount();
  // }, []); // Цей useEffect викликається тільки один раз при монтовані компонента

  // Викликаємо, коли змінюється значення count

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

        // Фільтруємо документи, якщо вони існують
        const documents = documentSnapshots.map((snapshot) =>
          snapshot.exists() ? snapshot.data() : null
        );

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
          {/* <TestsItem testItem={item}></TestsItem> */}
          cdsdsfsd <br></br>
          kombo
        </div>
      ))}
    </div>
  );
};

export default Tests;
//ВМІСТ КОМПОНЕНТА

//ЗАВАНТАЖУЄМО ДКУМЕНТ ПО ID
const fetchDocumentById = async (id: string) => {
  try {
    const docRef = doc(db, "tasks", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Test;
      console.log("Документ отримано: ", data); // Перевірка всіх даних документа
      return data;
    } else {
      console.log("Документ не знайдено!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    return null;
  }
};
//ЗАВАНТАЖУЄМО ДКУМЕНТ ПО ID

//ОТРИМУЄМО КОЛЕКЦІЮ ПО НАЗВІ
// const fetchCollection = async () => {
//   try {
//     const querySnapshot = await getDocs(collection(db, "tasks"));
//     return querySnapshot;
//   } catch (error) {
//     console.error("Error fetching document: ", error);
//     return null;
//   }
// };
//ОТРИМУЄМО КОЛЕКЦІЮ ПО НАЗВІ

//ОТРИМУЄМО ДКУМЕНТ ПО ID
// useEffect(() => {
//   const loadData = async () => {
//     const fetchedData = await fetchDocumentById("1");
//     if (fetchedData) {
//       setData(fetchedData);
//     }
//   };
//   loadData();
// }, []);
//ОТРИМУЄМО ДКУМЕНТ ПО ID
