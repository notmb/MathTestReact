export type {
  Answers,
  Comparison,
  ComparisonTable,
  Question,
  Task1,
  Task2,
  Task3,
  TaskType,
  Tasks,
} from "../../../types";

type TaskId = string;
type MatchingAnswer = Record<string, string>;
type UserAnswer = string | MatchingAnswer;

export type UserAnswersState = Record<TaskId, UserAnswer>;
