import type { ChangeEvent, FormEvent } from "react";
import type { VariantMetaDraft } from "./model/types";

type VariantMetaFormProps = {
  values: VariantMetaDraft;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onChange: (patch: Partial<VariantMetaDraft>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const VariantMetaForm = ({
  values,
  isSubmitting = false,
  errorMessage = null,
  onChange,
  onSubmit,
}: VariantMetaFormProps) => {
  const errorId = "variant-meta-form-error";

  const handleTextChange =
    (field: keyof VariantMetaDraft) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        [field]: event.currentTarget.value,
      } as Partial<VariantMetaDraft>);
    };

  return (
    <form className="form_for_description_new_variant" onSubmit={onSubmit}>
      <div className="conteiner_for_description">
        <div className="creator_variant_intro">
          <h2>Загальні дані варіанту</h2>
          <p>
            Спочатку заповни основну інформацію про тест. Після цього можна буде
            перейти до налаштування задач.
          </p>
        </div>

        <div className="name_new_variant">
          <label htmlFor="variantname">Назва теми або варіанту</label>
          <input
            id="variantname"
            name="variantName"
            type="text"
            placeholder="Наприклад: Квадратні рівняння"
            required
            value={values.variantName}
            onChange={handleTextChange("variantName")}
          />
        </div>

        <div className="variant_serial_number_new_variant">
          <label htmlFor="variant_serial_number">Номер варіанту</label>
          <input
            id="variant_serial_number"
            name="variantSerialNumber"
            type="text"
            placeholder="Наприклад: 1"
            required
            value={values.variantSerialNumber}
            onChange={handleTextChange("variantSerialNumber")}
          />
        </div>

        <div className="number_of_tasks_new_variant">
          <label htmlFor="number_of_tasks">Кількість завдань</label>
          <input
            id="number_of_tasks"
            name="numberOfTasks"
            type="number"
            min={1}
            placeholder="Наприклад: 12"
            required
            value={values.numberOfTasks}
            onChange={handleTextChange("numberOfTasks")}
          />
        </div>

        <fieldset className="variant_type_fieldset">
          <legend>Тип тесту</legend>
          <label htmlFor="type_test_main">
            <input
              id="type_test_main"
              checked={values.typeTest === "main"}
              type="radio"
              name="typeTest"
              value="main"
              onChange={handleTextChange("typeTest")}
            />
            Основний
          </label>
          <label htmlFor="type_test_retaking">
            <input
              id="type_test_retaking"
              checked={values.typeTest === "retaking"}
              type="radio"
              name="typeTest"
              value="retaking"
              onChange={handleTextChange("typeTest")}
            />
            Перездача
          </label>
        </fieldset>
      </div>

      <div className="creator_variant_actions">
        <button className="custom_button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Створення..." : "Створити варіант"}
        </button>
        {errorMessage && (
          <p id={errorId} role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
};

export default VariantMetaForm;
