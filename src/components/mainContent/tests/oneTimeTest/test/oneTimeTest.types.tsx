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

export type Comparison = ComparisonTable;

export type TaskType = "choice" | "comparison" | "openAnswer";

export interface Task1 {
  task: Question;
  answers: Answers;
  correctAnswer: string;
  typeOfTask: "choice";
}

export interface Task2 {
  task: Question;
  comparisonTable: ComparisonTable;
  correctComparison: Record<string, string>;
  typeOfTask: "comparison";
}

export interface Task3 {
  task: Question;
  correctAnswer: string;
  typeOfTask: "openAnswer";
}

export type Task = Task1 | Task2 | Task3;

export type Tasks = Record<string, Task>;

type TaskId = string; // doc id, але логічно = номер завдання
type MatchingAnswer = Record<string, string>;
type UserAnswer = string | MatchingAnswer;

export type UserAnswersState = Record<TaskId, UserAnswer>;

