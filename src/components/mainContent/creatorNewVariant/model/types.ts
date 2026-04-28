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

export type VariantType = "main" | "retaking";

export type VariantDraftStatus = "idle" | "creating" | "ready" | "error";

export type TaskDraftStatus = "empty" | "draft" | "saving" | "saved" | "error";

export interface VariantMetaDraft {
  variantName: string;
  variantSerialNumber: string;
  numberOfTasks: string;
  typeTest: VariantType;
  variantId: string | null;
}

export interface TaskItemDraft {
  numberTask: string;
  typeTask: TaskType | undefined;
  taskIsAdded: boolean;
}

export interface EmptyTaskDraft {
  numberTask: string;
  type: null;
  status: "empty";
  errorMessage: null;
  files: File[];
  data: null;
}

export interface TaskBaseDraft<
  TTaskType extends TaskType,
  TTaskData extends Task1 | Task2 | Task3,
> {
  numberTask: string;
  type: TTaskType;
  status: TaskDraftStatus;
  errorMessage: string | null;
  files: File[];
  data: TTaskData;
}

export interface ChoiceTaskPreviewUrls {
  taskPicture: string;
  answerPictures: string[];
}

export interface ChoiceTaskDraft extends TaskBaseDraft<"choice", Task1> {
  previewUrls: ChoiceTaskPreviewUrls;
}

export interface ComparisonTaskPreviewUrls {
  taskPicture: string;
  list1Pictures: string[];
  list2Pictures: string[];
}

export interface ComparisonTaskDraft extends TaskBaseDraft<
  "comparison",
  Task2
> {
  previewUrls: ComparisonTaskPreviewUrls;
}

export interface OpenAnswerTaskPreviewUrls {
  taskPicture: string;
}

export interface OpenAnswerTaskDraft extends TaskBaseDraft<
  "openAnswer",
  Task3
> {
  previewUrls: OpenAnswerTaskPreviewUrls;
}

export type TaskDraft =
  | EmptyTaskDraft
  | ChoiceTaskDraft
  | ComparisonTaskDraft
  | OpenAnswerTaskDraft;

export type TaskMapDraft = Record<string, TaskDraft>;

export interface VariantDraftState {
  meta: VariantMetaDraft;
  status: VariantDraftStatus;
  errorMessage: string | null;
  selectedTaskNumber: string | null;
  taskItems: TaskItemDraft[];
  taskDrafts: TaskMapDraft;
}

export interface CreateVariantPayload {
  variantName: string;
  variantSerialNumber: string;
  numberOfTasks: string;
  typeTest: VariantType;
}

export interface SaveTaskPayload {
  variantId: string;
  typeTest: VariantType;
  typeOfTask: TaskType;
  taskNumber: string;
  taskData: Task1 | Task2 | Task3;
  files?: File[];
}
