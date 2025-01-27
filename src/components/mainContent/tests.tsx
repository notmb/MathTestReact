import "./tests.css";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import TestsItem from "./testItem";
import TaskOpenAnswer from "./taskOpenAnswer";
import TaskChoice from "./taskChoice";
import TaskComparison from "./taskComparison";

interface Task1 {
  //тип даних для завдання з з вибором 1 відповіді
  task: {
    text: string;
    table?: {
      value1: string[];
      velue2: string[];
    };
    picture?: string;
    list?: string[];
  };
  answers: {
    values: string[];
    pictures?: string[];
  };
  correctAnswer: string;
  typeOfTask: string;
}

interface Task2 {
  //тип даних для завдання співставлення
  task: {
    text: string;
    table?: {
      value1: string[];
      velue2: string[];
    };
    picture?: string;
    list?: string[];
  };
  comparisonTable: {
    list1: {
      texts?: string[];
      pictures?: string[];
    };
    list2: {
      texts?: string[];
      picture?: string[];
    };
  };
  сorrectComparison: {
    [key: string]: string;
  };
  typeOfTask: string;
}

interface Task3 {
  //тип даних для завдання з відкритою відповіддю
  task: {
    text: string;
    table?: {
      value1: string[];
      velue2: string[];
    };
    picture?: string;
    list?: string[];
  };
  correctAnswer: string;
  typeOfTask: string;
}
interface Tasks {
  [key: string]: Task1 | Task2 | Task3; // Колекція з різними завданнями
}
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

  const [document1, setDocument1] = useState<Tasks>();

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

  const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
  const isTask2 = (task: any): task is Task2 =>
    task.typeOfTask === "comparison";
  const isTask3 = (task: any): task is Task3 =>
    task.typeOfTask === "openAnswer";
  //ГЕНЕРУЄМО ТЕСТ

  const getDocument1 = async () => {
    try {
      const docRef = doc(db, "topic 1", "variant 2"); // Створюємо посилання на документ
      const docSnap = await getDoc(docRef); // Отримуємо дані документа

      if (!docSnap.exists()) {
        throw new Error("Документ не знайдено!");
      }

      const data = docSnap.data(); // data - об'єкт, де кожна властивість це завдання
      const tasks: Tasks = Object.entries(data).reduce((acc, [key, value]) => {
        if (isTask1(value)) {
          acc[key] = value;
          return acc;
        }
        if (isTask2(value)) {
          acc[key] = value;
          return acc;
        }
        if (isTask3(value)) {
          acc[key] = value;
          return acc;
        } else {
          console.warn(`Невідомий тип завдання для ключа: ${key}`, value);
        }
        return acc;
      }, {} as Tasks);
      setDocument1(tasks);
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  };
  useEffect(() => {
    getDocument1();
  }, []);
  console.log(document1);

  const getDocument = async () => {
    try {
      const docRef = doc(db, "topic 1", "variant 1"); // Створюємо посилання на документ
      const docSnap = await getDoc(docRef); // Отримуємо дані документа

      if (docSnap.exists()) {
        // const data = docSnap.data() as Partial<TestItem>;
        const data = docSnap.data();

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
      {document1 &&
        Object.entries(document1).map(([key, task]) => (
          <div key={key}>
            {isTask3(task) && (
              <TaskOpenAnswer
                task={task.task}
                correctAnswer={task.correctAnswer}
                typeOfTask={task.typeOfTask}
                number={key}
                func={EditUserAnswer}
              />
            )}
            {isTask1(task) && (
              <TaskChoice
                task={task.task}
                answers={task.answers}
                correctAnswer={task.correctAnswer}
                typeOfTask={task.typeOfTask}
                number={key}
                func={EditUserAnswer}
              />
            )}
            {isTask2(task) && (
              <TaskComparison
                task={task.task}
                comparisonTable={task.comparisonTable}
                сorrectComparison={task.сorrectComparison}
                typeOfTask={task.typeOfTask}
                number={key}
                func={EditUserAnswer}
              />
            )}
          </div>
        ))}
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
