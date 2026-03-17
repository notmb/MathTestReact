import "./addVariant2.css";
import AddNewVariant from "./addVariant2";
import { VariantDraftProvider } from "./VariantDraftContext";

const AddNewVariantPage = () => {
  return (
    <VariantDraftProvider>
      <AddNewVariant />
    </VariantDraftProvider>
  );
};

export default AddNewVariantPage;
