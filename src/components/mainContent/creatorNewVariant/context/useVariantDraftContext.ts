import { useContext } from "react";
import { VariantDraftContext } from "./VariantDraftContext";

export const useVariantDraftContext = () => {
  const context = useContext(VariantDraftContext);
  if (!context) {
    throw new Error(
      "useVariantDraftContext must be used within VariantDraftProvider",
    );
  }

  return context;
};
