import VariantHeader from "./variantHeader";
import VariantActions from "./variantActions";
import TestReview from "../elementsForReviewTest/testReview";
import { useVariantContext } from "../../../../context/variantContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SelectedVariant = () => {
  const { dataVariant, tasks } = useVariantContext();
  const { variant, type } = useParams<{ variant: string; type: string }>();
  const navigate = useNavigate();

  if (!variant || !type) return <p>Некоректне посилання</p>;

  return (
    <main className="main_content">
      <VariantHeader
        dataVariant={dataVariant}
        onPass={() =>
          navigate(`/allTest/selectedVariant/${type}/${variant}/localTest`)
        }
        onOneTimePass={() =>
          navigate(`/allTest/selectedVariant/${type}/${variant}/one-time-links`)
        }
      />
      <VariantActions
        variant={variant}
        dataVariant={dataVariant}
        tasks={tasks}
      />
      <TestReview selectedVariant={variant} />
    </main>
  );
};
export default SelectedVariant;
