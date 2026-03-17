import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { TaskType } from "../types";

export type DraftTestType = "main" | "retaking";
export type DraftVariantStatus = "idle" | "creating" | "ready" | "error";

export interface DraftVariantMeta {
  variantName: string;
  variantSerialNumber: string;
  numberOfTasks: string;
  typeTest: DraftTestType;
  variantId: string | null;
}

export interface DraftTaskItem {
  numberTask: string;
  typeTask: TaskType | undefined;
  taskIsAdded: boolean;
}

type VariantDraftContextValue = {
  meta: DraftVariantMeta;
  status: DraftVariantStatus;
  selectedTaskNumber: string | null;
  tasks: DraftTaskItem[];
  setMeta: (nextMeta: DraftVariantMeta) => void;
  patchMeta: (patch: Partial<DraftVariantMeta>) => void;
  setStatus: (nextStatus: DraftVariantStatus) => void;
  setSelectedTaskNumber: (taskNumber: string | null) => void;
  setTasks: (items: DraftTaskItem[]) => void;
  initializeTasks: (count: number) => void;
};

const initialMeta: DraftVariantMeta = {
  variantName: "",
  variantSerialNumber: "",
  numberOfTasks: "",
  typeTest: "main",
  variantId: null,
};

const VariantDraftContext = createContext<VariantDraftContextValue | undefined>(
  undefined,
);

export const VariantDraftProvider = ({ children }: PropsWithChildren) => {
  const [meta, setMeta] = useState<DraftVariantMeta>(initialMeta);
  const [status, setStatus] = useState<DraftVariantStatus>("idle");
  const [selectedTaskNumber, setSelectedTaskNumber] = useState<string | null>(
    null,
  );
  const [tasks, setTasks] = useState<DraftTaskItem[]>([]);

  const value = useMemo<VariantDraftContextValue>(
    () => ({
      meta,
      status,
      selectedTaskNumber,
      tasks,
      setMeta,
      patchMeta: (patch) => setMeta((current) => ({ ...current, ...patch })),
      setStatus,
      setSelectedTaskNumber,
      setTasks,
      initializeTasks: (count) => {
        setTasks(
          Array.from({ length: count }, (_, index) => ({
            numberTask: String(index + 1),
            typeTask: undefined,
            taskIsAdded: false,
          })),
        );
      },
    }),
    [meta, selectedTaskNumber, status, tasks],
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
