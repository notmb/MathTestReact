import { Timestamp } from "firebase/firestore";
export type TaskType = "choice" | "comparison" | "openAnswer";

export interface Task1 {
  // Тип даних для завдання з вибором 1 відповіді
  task: Question;
  answers: Answers;
  correctAnswer: string;
  typeOfTask: "choice";
}
export interface Task2 {
  // Тип даних для завдання на співставлення
  task: Question;
  comparisonTable: ComparisonTable;
  correctComparison: CorrectComparison;
  typeOfTask: "comparison";
}
export interface Task3 {
  // Тип даних для завдання з відкритою відповіддю
  task: Question;
  correctAnswer: string;
  typeOfTask: "openAnswer";
}
export interface Question {
  text: string;
  table?: {
    value1: string[];
    value2: string[];
  };
  picture?: string;
  list?: string[];
}
export interface Answers {
  values: string[];
  pictures?: string[];
}
export interface ComparisonTable {
  list1: {
    texts?: string[];
    pictures?: string[];
  };
  list2: {
    texts?: string[];
    pictures?: string[];
  };
}
interface CorrectComparison {
  [key: string]: string;
}
export interface Tasks {
  // Колекція з різними завданнями
  [key: string]: Task1 | Task2 | Task3;
}
export type Comparison = ComparisonTable;

export interface VaiantData {
  id?: string;
  typeTest?: string;
  variantName: string;
  createdAt: Timestamp;
  numberOfTasks: string;
  variantSerialNumber: string;
}

