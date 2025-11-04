import type { VaiantData } from "../../types";
interface VariantHeaderProps {
  dataVariant: VaiantData;
  onPass: () => void;
  onOneTimePass: () => void;
}

const VariantHeader = ({
  dataVariant,
  onPass,
  onOneTimePass,
}: VariantHeaderProps) => {
  return (
    <header className="variant-header">
      <h2>{dataVariant.variantName}</h2>
      <div className="buttons">
        <button className="custom_button" onClick={onPass}>
          Пройти тест
        </button>
        <button className="custom_button" onClick={onOneTimePass}>
          Одноразові посилання
        </button>
      </div>
    </header>
  );
};

export default VariantHeader;
