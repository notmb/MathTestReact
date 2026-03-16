import type { Task1, Task2, Task3 } from "../types";

type ChoiceTask = Task1;
type ComparisonTask = Task2;
type OpenAnswerTask = Task3;

export type SupportedTask = ChoiceTask | ComparisonTask | OpenAnswerTask;

const hasTaskType = (
  task: unknown,
  expectedType: SupportedTask["typeOfTask"],
): task is SupportedTask => {
  return (
    !!task &&
    typeof task === "object" &&
    "typeOfTask" in task &&
    (task as { typeOfTask?: string }).typeOfTask === expectedType
  );
};

export const isChoiceTask = (task: unknown): task is ChoiceTask =>
  hasTaskType(task, "choice");

export const isComparisonTask = (task: unknown): task is ComparisonTask =>
  hasTaskType(task, "comparison");

export const isOpenAnswerTask = (task: unknown): task is OpenAnswerTask =>
  hasTaskType(task, "openAnswer");

export const isTask1 = isChoiceTask;
export const isTask2 = isComparisonTask;
export const isTask3 = isOpenAnswerTask;
