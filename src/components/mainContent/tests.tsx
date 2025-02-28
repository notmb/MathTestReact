import "./tests.css";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import TaskOpenAnswer from "./taskOpenAnswer";
import TaskChoice from "./taskChoice";
import TaskComparison from "./taskComparison";

interface Task1 {
  //тип даних для завдання з з вибором 1 відповіді
  task: Question;
  answers: Answers;
  correctAnswer: string;
  typeOfTask: string;
}
interface Task2 {
  //тип даних для завдання співставлення
  task: Question;
  comparisonTable: ComparisonTable;
  сorrectComparison: CorrectComparison;
  typeOfTask: string;
}
interface Task3 {
  //тип даних для завдання з відкритою відповіддю
  task: Question;
  correctAnswer: string;
  typeOfTask: string;
}
interface Tasks {
  // Колекція з різними завданнями
  [key: string]: Task1 | Task2 | Task3;
}
interface Question {
  text: string;
  table?: {
    value1: string[];
    value2: string[];
  };
  picture?: string;
  list?: string[];
}
interface Answers {
  values: string[];
  pictures?: string[];
}
interface ComparisonTable {
  list1: {
    texts?: string[];
    pictures?: string[];
  };
  list2: {
    texts?: string[];
    picture?: string[];
  };
}
interface CorrectComparison {
  [key: string]: string;
}

const Tests = () => {
  const [document1, setDocument1] = useState<Tasks>();

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: any }>({});

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
      const docRef = doc(db, "topic 1", "variant 4"); // Створюємо посилання на документ
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

  const TestCheck1 = () => {
    const comparison: { [key: string]: number } = {};
    let maxMark = 0;
    document1 &&
      Object.entries(document1).forEach(([key, item]) => {
        console.log(key);
        if (isTask1(item)) {
          maxMark = maxMark + 1;
          if (item.correctAnswer === userAnswers[key]) {
            comparison[key] = 1;
            console.log(comparison);
          } else {
            comparison[key] = 0;
          }
        }
        if (isTask2(item)) {
          maxMark = maxMark + 3;
          comparison[key] = CheckComparison(
            item.сorrectComparison,
            userAnswers[key]
          );
        }
        if (isTask3(item)) {
          maxMark = maxMark + 2;
          if (item.correctAnswer === userAnswers[key]) {
            comparison[key] = 2;
            console.log(comparison);
          } else {
            comparison[key] = 0;
          }
        }
      });
    console.log(comparison);
    console.log(maxMark);
    let sum = 0;
    Object.values(comparison).map((value) => {
      sum = sum + value; // Додаємо значення
    });
    alert(
      "Твій бал за тест: " +
        sum +
        "\nТвій бал у форматі НМТ: " +
        Math.round((sum * 200) / maxMark)
    );
  };
  console.log();

  //ГЕНЕРУЄМО ТЕСТ
  return (
    <div className="conteiner_for_test">
      <div className="tests">
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
        {!document1 && <p>Loading...</p>}
        <button className="check_button" onClick={TestCheck1}>
          Перевірити
        </button>
      </div>
    </div>
  );
};

export default Tests;
