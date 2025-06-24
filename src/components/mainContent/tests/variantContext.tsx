import { createContext, useContext } from "react";
import type { Tasks, VaiantData } from "../creatorVariant/types";

export type VariantContextType = {
  tasks: Tasks;
  dataVariant: VaiantData;
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
