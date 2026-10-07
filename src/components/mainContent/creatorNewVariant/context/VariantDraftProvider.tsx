import { useMemo, useState, type PropsWithChildren } from "react";
import {
  createEmptyTaskDraft,
  createEmptyTaskDraftByType,
  createEmptyVariantDraftState,
  createTaskItems,
} from "../model/factories";
import type { VariantDraftState } from "../model/types";
import { VariantDraftContext, type VariantDraftContextValue } from "./VariantDraftContext";

const initialDraftState = createEmptyVariantDraftState();

// Компонент - зберігає стан і надає доступ до нього
export const VariantDraftProvider = ({ children }: PropsWithChildren) => {
  //тут живуть дані чернетки -> initialDraftState - створює внутрішню структуру задач загалом
  const [state, setState] = useState<VariantDraftState>(initialDraftState);

  //Далі формується об’єкт value, у якому зібрані стан і функції:
  //setStatus, patchMeta, setErrorMessage — не окремі стейти.
  //Це твої функції, які змінюють різні частини одного state через setState.
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

