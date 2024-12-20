import "./tests.css";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import TestsItem from "./testItem";

interface Answers {
  values: string[];
  pictures: string[];
}
interface Comparison {
  list1: string[];
  list2: string[];
}
interface CorrectComparison {
  [key: string]: string;
}
interface TaskData {
  task: string[];
  answers: Answers;
  correctAnswer: string | CorrectComparison;
  typeOfTask: string;
  comparisonTable: Comparison;
}
interface TestItem {
  [key: string]: TaskData; // Колекція з різними завданнями
}

const Tests = () => {
  const [document, setDocument] = useState<TestItem>();

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: any }>({});

  const addAnswer = (key: string, answer: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [key]: answer, // Додаємо нову відповідь з власним ключем
    }));
  };

  const EditUserAnswer = (key: string, newAnswer: any) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers, // зберігаємо попередні значення
      [key]: newAnswer, // оновлюємо значення для конкретного ключа
    }));
  };

  console.log(userAnswers);

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
              answers: taskData?.answers ?? { values: [], pictures: [] },
              correctAnswer: taskData?.correctAnswer ?? "Немає відповіді",
              typeOfTask: taskData?.typeOfTask ?? "unknown",
              comparisonTable: taskData?.comparisonTable ?? {
                list1: [],
                list2: [],
              },
            };
            addAnswer(key, "");

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

  const CheckComparison = (
    correctAnswer: CorrectComparison,
    userAnswers: CorrectComparison
  ) => {
    let mark = 0;
    Object.entries(userAnswers).forEach(([key, item]) => {
      if (item === correctAnswer[key]) {
        mark = mark + 1;
      }
    });
    return mark;
  };

  const TestCheck = () => {
    const comparison: { [key: string]: number } = {};
    document &&
      Object.entries(document).forEach(([key, item]) => {
        console.log(key);
        if (item.typeOfTask === "choice") {
          if (item.correctAnswer === userAnswers[key]) {
            comparison[key] = 1;
            console.log(comparison);
          } else {
            comparison[key] = 0;
          }
        }
        if (item.typeOfTask === "openAnswer") {
          if (item.correctAnswer === userAnswers[key]) {
            comparison[key] = 2;
            console.log(comparison);
          } else {
            comparison[key] = 0;
          }
        } else {
          if (typeof item.correctAnswer == "object") {
            comparison[key] = CheckComparison(
              item.correctAnswer,
              userAnswers[key]
            );
          }
        }
      });
    console.log(comparison);
    let sum = 0;
    Object.values(comparison).map((value) => {
      sum = sum + value; // Додаємо значення
    });
    alert(
      "Твій бал за тест: " +
        sum +
        "\nТвій бал у форматі НМТ: " +
        Math.round((sum * 200) / 17)
    );
  };

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
                func={EditUserAnswer}
              />
            </div>
          ))}
        {!document && <p>Loading...</p>}
        <button className="check_button" onClick={TestCheck}>
          Перевірити
        </button>
      </div>
    </div>
  );
};

export default Tests;
