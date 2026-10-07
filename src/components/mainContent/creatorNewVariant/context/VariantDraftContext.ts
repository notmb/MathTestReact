import { createContext } from "react";
import type {
  TaskDraft,
  VariantDraftState,
  VariantMetaDraft,
} from "../model/types";
import type { TaskType } from "../../types";

export type VariantDraftContextValue = {
  state: VariantDraftState;
  setMeta: (nextMeta: VariantMetaDraft) => void;
  patchMeta: (patch: Partial<VariantMetaDraft>) => void;
  setStatus: (nextStatus: VariantDraftState["status"]) => void;
  setErrorMessage: (message: string | null) => void;
  setSelectedTaskNumber: (taskNumber: string | null) => void;
  setTaskItems: (items: VariantDraftState["taskItems"]) => void;
  initializeTasks: (count: number) => void;
  setTaskType: (taskNumber: string, type: TaskType) => void;
  updateTaskDraft: (
    taskNumber: string,
    updater: (current: TaskDraft) => TaskDraft,
  ) => void;
};

export const VariantDraftContext = createContext<VariantDraftContextValue | undefined>(
  undefined,
);
