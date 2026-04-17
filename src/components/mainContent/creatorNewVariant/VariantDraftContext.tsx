import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  createEmptyTaskDraft,
  createEmptyTaskDraftByType,
  createEmptyVariantDraftState,
  createTaskItems,
} from "./model/factories";
import type {
  TaskDraft,
  VariantDraftState,
  VariantMetaDraft,
} from "./model/types";
import type { TaskType } from "../types";

type VariantDraftContextValue = {
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

const initialDraftState = createEmptyVariantDraftState();

const VariantDraftContext = createContext<VariantDraftContextValue | undefined>(
  undefined,
);

export const VariantDraftProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<VariantDraftState>(initialDraftState);

  const value = useMemo<VariantDraftContextValue>(
    () => ({
      state,
      setMeta: (nextMeta) => {
        setState((current) => ({
          ...current,
          meta: nextMeta,
        }));
      },
      patchMeta: (patch) => {
        setState((current) => {
          return {
            ...current,
            meta: {
              ...current.meta,
              ...patch,
            },
          };
        });
      },
      setStatus: (nextStatus) => {
        setState((current) => ({
          ...current,
          status: nextStatus,
        }));
      },
      setErrorMessage: (message) => {
        setState((current) => ({
          ...current,
          errorMessage: message,
        }));
      },
      setSelectedTaskNumber: (taskNumber) => {
        setState((current) => ({
          ...current,
          selectedTaskNumber: taskNumber,
        }));
      },
      setTaskItems: (items) => {
        setState((current) => ({
          ...current,
          taskItems: items,
        }));
      },
      initializeTasks: (count) => {
        const taskItems = createTaskItems(count);
        const taskDrafts = Object.fromEntries(
          taskItems.map((item) => [
            item.numberTask,
            createEmptyTaskDraft(item.numberTask),
          ]),
        );

        setState((current) => ({
          ...current,
          selectedTaskNumber: taskItems[0]?.numberTask ?? null,
          taskItems,
          taskDrafts,
        }));
      },
      setTaskType: (taskNumber, type) => {
        setState((current) => ({
          ...current,
          taskItems: current.taskItems.map((item) =>
            item.numberTask === taskNumber
              ? {
                  ...item,
                  typeTask: type,
                }
              : item,
          ),
          taskDrafts: {
            ...current.taskDrafts,
            [taskNumber]: createEmptyTaskDraftByType(taskNumber, type),
          },
        }));
      },
      updateTaskDraft: (taskNumber, updater) => {
        setState((current) => {
          const currentTaskDraft =
            current.taskDrafts[taskNumber] ?? createEmptyTaskDraft(taskNumber);

          return {
            ...current,
            taskDrafts: {
              ...current.taskDrafts,
              [taskNumber]: updater(currentTaskDraft),
            },
          };
        });
      },
    }),
    [state],
  );

  return (
    <VariantDraftContext.Provider value={value}>
      {children}
    </VariantDraftContext.Provider>
  );
};

export const useVariantDraftContext = () => {
  const context = useContext(VariantDraftContext);
  if (!context) {
    throw new Error(
      "useVariantDraftContext must be used within VariantDraftProvider",
    );
  }

  return context;
};
