import "./styles/creatorNewVariant.css";
import CreatorNewVariantFlow from "./CreatorNewVariantFlow";
import { VariantDraftProvider } from "./context/VariantDraftProvider";

const AddNewVariantPage = () => {
  return (
    <VariantDraftProvider>
      <CreatorNewVariantFlow />
    </VariantDraftProvider>
  );
};

export default AddNewVariantPage;
