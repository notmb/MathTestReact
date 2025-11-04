import { useVariantContext } from "../../../../context/variantContext";
import { useImmer } from "use-immer";
import MathTest2 from "../mathTest2";
import type { Task1, Task2, Task3 } from "../../types";

const LocalTest = () => {
  const { tasks, dataVariant } = useVariantContext();

  const [userAnswers, updateUserAnswers] = useImmer<{ [key: string]: any }>({});

  if (!tasks) return <p>Завантаження...</p>;

  const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
  const isTask2 = (task: any): task is Task2 =>
    task.typeOfTask === "comparison";
  const isTask3 = (task: any): task is Task3 =>
    task.typeOfTask === "openAnswer";

  const CheckComparison = (
    correctAnswer: {
      [key: string]: string;
    },
    userAnswers: {
      [key: string]: string;
    }
  ) => {
    let mark = 0;
    console.log(userAnswers);
    Object.entries(userAnswers).forEach(([key, item]) => {
      if (item === correctAnswer[key]) {
        mark = mark + 1;
      }
    });
    return mark;
  };

  const testCheck = (userAnswers: { [key: string]: any }) => {
    const comparison: { [key: string]: number } = {};
    let maxMark = 0;

    tasks &&
      Object.entries(tasks).forEach(([key, item]) => {
        if (isTask1(item)) {
          maxMark += 1;
          if (item.correctAnswer === userAnswers[key]) {
            comparison[key] = 1;
          } else {
            comparison[key] = 0;
          }
        }
        if (isTask2(item)) {
          maxMark += 3;
          comparison[key] = CheckComparison(
            item.correctComparison,
            userAnswers[key]
          );
        }
        if (isTask3(item)) {
          maxMark += 2;
          const correct = Number(item.correctAnswer?.replace(",", "."));
          const user = Number(userAnswers[key]?.replace(",", "."));
          console.log(correct, userAnswers[key]);
          if (!isNaN(correct) && !isNaN(user) && correct === user) {
            comparison[key] = 2;
            console.log(comparison);
          } else {
            comparison[key] = 0;
          }
        }
      });

    let sum = 0;
    Object.values(comparison).map((value) => {
      sum = sum + value; // Додаємо значення
    });

    // Бал у НМТ
    function getNmtMark(sum: number): number | string {
      const map: { [key: number]: number } = {
        5: 100,
        6: 108,
        7: 115,
        8: 123,
        9: 131,
        10: 134,
        11: 137,
        12: 140,
        13: 143,
        14: 145,
        15: 147,
        16: 148,
        17: 149,
        18: 150,
        19: 151,
        20: 152,
        21: 155,
        22: 159,
        23: 163,
        24: 167,
        25: 170,
        26: 173,
        27: 176,
        28: 180,
        29: 184,
        30: 189,
        31: 194,
        32: 200,
      };

      return map[sum] ?? "Тест не пройдено";
    }

    const nmtMark = getNmtMark(sum);

    return { sum, nmtMark, comparison };
  };
  //ПЕРЕВІРКА

  const checkAndEnd = (userAnswers: { [key: string]: any }) => {
    const result = testCheck(userAnswers);

    alert(
      "Твій бал за тест: " +
        result.sum +
        "\nТвій бал у форматі НМТ: " +
        result.nmtMark
    );
  };

  return (
    <div>
      <h2>{dataVariant.variantName}</h2>
      <MathTest2 updateUserAnswers={updateUserAnswers}></MathTest2>
      <button onClick={() => checkAndEnd(userAnswers)}>Завершити</button>
    </div>
  );
};

export default LocalTest;
