import { useState, type FormEvent } from "react";
import TaskEditorPanel from "./TaskEditorPanel";
import TaskEditorRouter from "./TaskEditorRouter";
import { useVariantDraftContext } from "./VariantDraftContext";
import VariantMetaForm from "./VariantMetaForm";
import { createVariant } from "./model/persistence";
import VariantTaskGrid from "./VariantTaskGrid";
import { validateVariantMeta } from "./model/validation";

// ооркестер - головний компонент
const CreatorNewVariantFlow = () => {
  const [isMetaCollapsed, setIsMetaCollapsed] = useState(false);

  const {
    state,
    initializeTasks,
    patchMeta,
    setErrorMessage,
    setSelectedTaskNumber,
    setStatus,
    setTaskType,
  } = useVariantDraftContext(); // контекст

  const handleSubmitMeta = async (event: FormEvent<HTMLFormElement>) => {
    // ф-я створення варіанту
    event.preventDefault();

    const validationError = validateVariantMeta(state.meta); //валідує state.meta

    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      return;
    }

    const taskCount = Number(state.meta.numberOfTasks); // к-сть задач

    try {
      setErrorMessage(null);
      setStatus("creating");

      const result = await createVariant({
        //створює документ варіанту в firestore
        variantName: state.meta.variantName,
        variantSerialNumber: state.meta.variantSerialNumber,
        numberOfTasks: state.meta.numberOfTasks,
        typeTest: state.meta.typeTest,
      });

      patchMeta({
        //записується id створеного варіанту
        variantId: result.variantId,
      });
      initializeTasks(taskCount); //створює внутрішню структуру задач загалом
      setStatus("ready"); // базовий етап завершено
      setIsMetaCollapsed(true); // ховає велику форму метаданих
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не вдалося створити варіант.";

      setStatus("error");
      setErrorMessage(message);
    }
  };

  const selectedTaskType =
    // якщо номер задачі не вибрано то selectedTaskType == ""
    state.selectedTaskNumber === null
      ? ""
      : // якщо вибрана - то візяти її type, тільки якщо чернетка існує
        (state.taskDrafts[state.selectedTaskNumber]?.type ?? "");

  const selectedTaskDraft = //
    state.selectedTaskNumber === null
      ? null
      : (state.taskDrafts[state.selectedTaskNumber] ?? null);

  const handleSelectTaskType = (
    // функція обробляє вибір типу для поточної задачі
    taskType: "choice" | "comparison" | "openAnswer",
  ) => {
    if (!state.selectedTaskNumber) {
      return;
    }

    setTaskType(state.selectedTaskNumber, taskType);
  };

  return (
    <section className="creator_new_variant">
      {isMetaCollapsed ? (
        <section className="creator_meta_summary">
          <div className="creator_meta_summary__header">
            <div>
              <p className="creator_meta_summary__eyebrow">
                Базові дані варіанту збережені
              </p>
              <h2 className="creator_meta_summary__title">
                {state.meta.variantName || "Без назви"}
              </h2>
            </div>
            <button
              className="creator_meta_summary__edit_button"
              type="button"
              onClick={() => setIsMetaCollapsed(false)}
            >
              Редагувати
            </button>
          </div>

          <dl className="creator_meta_summary__grid">
            <div>
              <dt>Номер</dt>
              <dd>{state.meta.variantSerialNumber || "Не вказано"}</dd>
            </div>
            <div>
              <dt>Кількість задач</dt>
              <dd>{state.meta.numberOfTasks || "Не вказано"}</dd>
            </div>
            <div>
              <dt>Тип тесту</dt>
              <dd>
                {state.meta.typeTest === "retaking" ? "Перездача" : "Основний"}
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <section className="creator_new_variant">
          <VariantMetaForm
            values={state.meta}
            isSubmitting={state.status === "creating"}
            errorMessage={state.errorMessage}
            onChange={patchMeta}
            onSubmit={handleSubmitMeta}
          />
        </section>
      )}

      {state.taskItems.length > 0 && (
        <>
          <VariantTaskGrid
            tasks={state.taskItems}
            taskDrafts={state.taskDrafts}
            selectedTaskNumber={state.selectedTaskNumber}
            onSelectTask={setSelectedTaskNumber}
          />
          <TaskEditorPanel
            selectedTaskNumber={state.selectedTaskNumber}
            selectedTaskType={selectedTaskType}
            onSelectTaskType={handleSelectTaskType}
          >
            {selectedTaskDraft && (
              <TaskEditorRouter taskDraft={selectedTaskDraft} />
            )}
          </TaskEditorPanel>
        </>
      )}
    </section>
  );
};

export default CreatorNewVariantFlow;
