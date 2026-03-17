import type { ChangeEvent, FormEvent } from "react";
import type { DraftVariantMeta } from "./VariantDraftContext";

type VariantMetaFormProps = {
  values: DraftVariantMeta;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onChange: (patch: Partial<DraftVariantMeta>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const VariantMetaForm = ({
  values,
  isSubmitting = false,
  errorMessage = null,
  onChange,
  onSubmit,
}: VariantMetaFormProps) => {
  const handleTextChange =
    (field: keyof DraftVariantMeta) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ [field]: event.currentTarget.value } as Partial<DraftVariantMeta>);
    };

  return (
    <form className="form_for_description_new_variant" onSubmit={onSubmit}>
      <div className="conteiner_for_description">
        <div className="name_new_variant">
          <label htmlFor="variantname">Назва теми (варіанту):</label>
          <input
            id="variantname"
            name="variantName"
            type="text"
            value={values.variantName}
            onChange={handleTextChange("variantName")}
          />
        </div>

        <div className="variant_serial_number_new_variant">
          <label htmlFor="variant_serial_number">Номер теми (варіанту):</label>
          <input
            id="variant_serial_number"
            name="variantSerialNumber"
            type="text"
            value={values.variantSerialNumber}
            onChange={handleTextChange("variantSerialNumber")}
          />
        </div>

        <div className="number_of_tasks_new_variant">
          <label htmlFor="number_of_tasks">Кількість завдань:</label>
          <input
            id="number_of_tasks"
            name="numberOfTasks"
            type="number"
            min={1}
            value={values.numberOfTasks}
            onChange={handleTextChange("numberOfTasks")}
          />
        </div>

        <fieldset>
          <legend>Перездача чи основний</legend>
          <label>
            <input
              checked={values.typeTest === "retaking"}
              type="radio"
              name="typeTest"
              value="retaking"
              onChange={handleTextChange("typeTest")}
            />
            Перездача
          </label>
          <label>
            <input
              checked={values.typeTest === "main"}
              type="radio"
              name="typeTest"
              value="main"
              onChange={handleTextChange("typeTest")}
            />
            Основний
          </label>
        </fieldset>
      </div>

      <div>
        <button className="custom_button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Створення..." : "Створити варіант"}
        </button>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </form>
  );
};

export default VariantMetaForm;
