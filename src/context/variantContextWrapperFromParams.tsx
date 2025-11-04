import { useParams } from "react-router-dom";
import VariantContextWrapper from "../context/variantContextWrapper";
import { ReactNode } from "react";

const VariantContextWrapperFromParams = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { type, variant } = useParams<{ type: string; variant: string }>();

  if (!type || !variant) {
    return <p>Некоректне посилання або відсутні параметри.</p>;
  }

  return (
    <VariantContextWrapper variant={variant} typeTest={type}>
      {children}
    </VariantContextWrapper>
  );
};

export default VariantContextWrapperFromParams;
