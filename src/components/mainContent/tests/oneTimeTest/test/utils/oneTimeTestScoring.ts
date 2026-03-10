import type { Task1, Task2, Task3, Tasks } from "../oneTimeTest.types";

export type PointsForTasks = Record<string, number>;

const isTask1 = (task: Task1 | Task2 | Task3): task is Task1 =>
  task.typeOfTask === "choice";
const isTask2 = (task: Task1 | Task2 | Task3): task is Task2 =>
  task.typeOfTask === "comparison";
const isTask3 = (task: Task1 | Task2 | Task3): task is Task3 =>
  task.typeOfTask === "openAnswer";

const getNmtMark = (sum: number): number | string => {
  const map: Record<number, number> = {
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

  if (sum < 5) return "point<5, не пройдено";
  return map[sum] ?? "помилка результату";
};

const normalizeNumberAnswer = (value: unknown): number | null => {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const num = Number(String(value).replace(",", ".").trim());
  return Number.isFinite(num) ? num : null;
};

const scoreComparisonAnswer = (
  correct: Record<string, string>,
  userAnswer: unknown,
) => {
  if (!userAnswer || typeof userAnswer !== "object") return 0;

  let score = 0;
  Object.entries(correct).forEach(([key, correctValue]) => {
    const userValue = (userAnswer as Record<string, unknown>)[key];
    if (typeof userValue === "string" && userValue === correctValue) {
      score += 1;
    }
  });

  return score;
};

export const buildResultDetails = (
  tasks: Tasks | null,
  answers: Record<string, any>,
) => {
  if (!tasks) {
    const answeredCount = Object.keys(answers).length;
    return {
      sum: 0,
      pointsForTasks: {} as PointsForTasks,
      result: `${answeredCount}/?`,
    };
  }

  let sum = 0;
  const pointsForTasks: PointsForTasks = {};

  Object.entries(tasks).forEach(([taskId, task]) => {
    const userAnswer = answers[taskId];
    let points = 0;

    if (isTask1(task)) {
      if (typeof userAnswer === "string" && userAnswer === task.correctAnswer) {
        points = 1;
      }
      pointsForTasks[taskId] = points;
      sum += points;
      return;
    }

    if (isTask2(task)) {
      points = scoreComparisonAnswer(task.correctComparison, userAnswer);
      pointsForTasks[taskId] = points;
      sum += points;
      return;
    }

    if (isTask3(task)) {
      const correct = normalizeNumberAnswer(task.correctAnswer);
      const user = normalizeNumberAnswer(userAnswer);
      if (correct !== null && user !== null && correct === user) {
        points = 2;
      }
      pointsForTasks[taskId] = points;
      sum += points;
    }
  });

  return {
    sum,
    pointsForTasks,
    result: `${sum}/${getNmtMark(sum)}`,
  };
};

export const buildTestResultString = (
  tasks: Tasks | null,
  answers: Record<string, any>,
) => {
  return buildResultDetails(tasks, answers).result;
};


