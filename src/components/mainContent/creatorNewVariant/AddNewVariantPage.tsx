import "./creatorNewVariant.css";
import CreatorNewVariantFlow from "./CreatorNewVariantFlow";
import { VariantDraftProvider } from "./VariantDraftContext";

const AddNewVariantPage = () => {
  return (
    <VariantDraftProvider>
      <CreatorNewVariantFlow />
    </VariantDraftProvider>
  );
};

export default AddNewVariantPage;
