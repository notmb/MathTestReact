import {
  VariantMetaDraft,
  TaskDraft,
  ChoiceTaskDraft,
  ComparisonTaskDraft,
  OpenAnswerTaskDraft,
  TaskItemDraft,
  VariantDraftState,
} from "./types";
import { TaskType } from "../../types";

export const createEmptyVariantMeta = (): VariantMetaDraft => ({
  variantName: "",
  variantSerialNumber: "",
  numberOfTasks: "",
  typeTest: "main",
  variantId: null,
});

export const createEmptyTaskDraft = (taskNumber: string): TaskDraft => ({
  numberTask: taskNumber,
  type: null,
  status: "empty",
  errorMessage: null,
  files: [],
  data: null,
});

export const createEmptyChoiceTask = (taskNumber: string): ChoiceTaskDraft => ({
  numberTask: taskNumber,
  type: "choice",
  status: "draft",
  errorMessage: null,
  files: [],
  data: {
    task: {
      text: "",
      table: {
        value1: [],
        value2: [],
      },
      picture: "",
      list: [],
    },
    answers: {
      values: [],
      pictures: [],
    },
    correctAnswer: "",
    typeOfTask: "choice",
  },
});

export const createEmptyComparisonTask = (
  taskNumber: string,
): ComparisonTaskDraft => ({
  numberTask: taskNumber,
  type: "comparison",
  status: "draft",
  errorMessage: null,
  files: [],
  data: {
    task: {
      text: "",
      table: {
        value1: [],
        value2: [],
      },
      picture: "",
      list: [],
    },
    comparisonTable: {
      list1: {
        texts: [],
        pictures: [],
      },
      list2: {
        texts: [],
        pictures: [],
      },
    },
    correctComparison: {
      1: "",
      2: "",
      3: "",
    },
    typeOfTask: "comparison",
  },
});

export const createEmptyOpenAnswerTask = (
  taskNumber: string,
): OpenAnswerTaskDraft => ({
  numberTask: taskNumber,
  type: "openAnswer",
  status: "draft",
  errorMessage: null,
  files: [],
  data: {
    task: {
      text: "",
      table: {
        value1: [],
        value2: [],
      },
      picture: "",
      list: [],
    },
    correctAnswer: "",
    typeOfTask: "openAnswer",
  },
});

const createEmptyTaskItem = (taskNumber: string): TaskItemDraft => ({
  numberTask: taskNumber,
  typeTask: undefined,
  taskIsAdded: false,
});

export const createTaskItems = (count: number): TaskItemDraft[] =>
  Array.from({ length: count }, (_, index) =>
    createEmptyTaskItem(String(index + 1)),
  );

export const createEmptyTaskDraftByType = (
  taskNumber: string,
  type: TaskType,
): TaskDraft => {
  switch (type) {
    case "choice":
      return createEmptyChoiceTask(taskNumber);
    case "comparison":
      return createEmptyComparisonTask(taskNumber);
    case "openAnswer":
      return createEmptyOpenAnswerTask(taskNumber);
  }
};

export const createEmptyVariantDraftState = (): VariantDraftState => ({
  meta: createEmptyVariantMeta(),
  status: "idle",
  errorMessage: null,
  selectedTaskNumber: null,
  taskItems: [],
  taskDrafts: {},
});
