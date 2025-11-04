import { createContext, useContext } from "react";
import type {
  Tasks,
  VaiantData,
  Task1,
  Task2,
  Task3,
} from "../components/mainContent/types";

export type VariantContextType = {
  tasks: Tasks;
  dataVariant: VaiantData;
  updateTask: (numTask: string, updatedTask: Task1 | Task2 | Task3) => void;
};

export const VariantContext = createContext<VariantContextType | undefined>(
  undefined
);

export const useVariantContext = () => {
  const context = useContext(VariantContext);
  if (!context)
    throw new Error("useVariantContext must be used within VariantProvider");
  return context;
};
