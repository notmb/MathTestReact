import type { Task1, Task2, Task3, TaskType } from "../../types";

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

export interface ComparisonTaskDraft
  extends TaskBaseDraft<"comparison", Task2> {
  previewUrls: ComparisonTaskPreviewUrls;
}

export interface OpenAnswerTaskPreviewUrls {
  taskPicture: string;
}

export interface OpenAnswerTaskDraft
  extends TaskBaseDraft<"openAnswer", Task3> {
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
