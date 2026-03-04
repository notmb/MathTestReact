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

type TaskId = string; // doc id, але логічно = номер завдання

type MatchingAnswer = Record<string, string>;

type UserAnswer = string | MatchingAnswer;

export type UserAnswersState = Record<TaskId, UserAnswer>;
