export interface Task1 {
  //тип даних для завдання з з вибором 1 відповіді
  task: Question;
  answers: Answers;
  correctAnswer: string;
  typeOfTask: string;
}
export interface Task2 {
  //тип даних для завдання співставлення
  task: Question;
  comparisonTable: ComparisonTable;
  correctComparison: CorrectComparison;
  typeOfTask: string;
}
export interface Task3 {
  //тип даних для завдання з відкритою відповіддю
  task: Question;
  correctAnswer: string;
  typeOfTask: string;
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
export interface Comparison {
  list1: {
    texts?: string[];
    pictures?: string[];
  };
  list2: {
    texts?: string[];
    picture?: string[];
  };
}
