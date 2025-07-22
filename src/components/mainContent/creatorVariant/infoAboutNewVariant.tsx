import { useState } from "react";
//ФОРМА ДЛЯ ОСНОВНОЇ ІНФОРМАЦІЇ ПРО ВАРІАНТ
const InfoAboutNewVariant = (props: {
  handleClickSet: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  const [isActive, setIsActive] = useState(true);

  const deactivateWindow = () => {
    setIsActive(false); // Змінюємо висоту компонента
  };
  const activateWindow = () => {
    setIsActive(true); // Змінюємо висоту компонента
  };
  return (
    <div className="new_variant">
      <form
        className="form_for_description_new_variant"
        onSubmit={props.handleClickSet}
      >
        <div
          className={`conteiner_for_description transition-height ${
            isActive ? "max-h-40" : "max-h-8"
          }`}
        >
          <div className="name_new_variant">
            <label htmlFor="variantname">Назва теми (варіанту):</label>
            <input type="text" id="variantname" name="variantName" />
          </div>

          <div className="variant_serial_number_new_variant">
            <label htmlFor="variant_serial_number">
              Номер теми (варіанту):
            </label>
            <input
              type="text"
              id="variant_serial_number"
              name="variantSerialNumber"
            />
          </div>

          <div className="number_of_tasks_new_variant">
            <label htmlFor="number_of_tasks">Кількість завдань:</label>
            <input type="text" id="number_of_tasks" name="numberOfTasks" />
          </div>
        </div>
        <div>
          <button
            className={isActive ? "hidden" : "custom_button"}
            type="button"
            onClick={activateWindow}
          >
            Редагувати
          </button>
          <button
            className={isActive ? "custom_button" : "hidden"}
            type="submit"
            onClick={deactivateWindow}
          >
            Ок
          </button>
        </div>
      </form>
    </div>
  );
};
//ФОРМА ДЛЯ ОСНОВНОЇ ІНФОРМАЦІЇ
export default InfoAboutNewVariant;
