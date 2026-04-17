import { useState, type FormEvent } from "react";
import TaskEditorPanel from "./TaskEditorPanel";
import TaskEditorRouter from "./TaskEditorRouter";
import { useVariantDraftContext } from "./VariantDraftContext";
import VariantMetaForm from "./VariantMetaForm";
import VariantTaskGrid from "./VariantTaskGrid";
import { validateVariantMeta } from "./model/validation";

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
  } = useVariantDraftContext();

  const handleSubmitMeta = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const taskCount = Number(state.meta.numberOfTasks);
    const validationError = validateVariantMeta(state.meta);

    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);
    setStatus("ready");
    initializeTasks(taskCount);
    setIsMetaCollapsed(true);
  };

  const selectedTaskType =
    state.selectedTaskNumber === null
      ? ""
      : (state.taskDrafts[state.selectedTaskNumber]?.type ?? "");

  const selectedTaskDraft =
    state.selectedTaskNumber === null
      ? null
      : (state.taskDrafts[state.selectedTaskNumber] ?? null);

  const handleSelectTaskType = (
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
                Р‘Р°Р·РѕРІС– РґР°РЅС– РІР°СЂС–Р°РЅС‚Сѓ Р·Р±РµСЂРµР¶РµРЅС–
              </p>
              <h2 className="creator_meta_summary__title">
                {state.meta.variantName || "Р‘РµР· РЅР°Р·РІРё"}
              </h2>
            </div>
            <button
              className="creator_meta_summary__edit_button"
              type="button"
              onClick={() => setIsMetaCollapsed(false)}
            >
              Р РµРґР°РіСѓРІР°С‚Рё
            </button>
          </div>

          <dl className="creator_meta_summary__grid">
            <div>
              <dt>РќРѕРјРµСЂ</dt>
              <dd>{state.meta.variantSerialNumber || "РќРµ РІРєР°Р·Р°РЅРѕ"}</dd>
            </div>
            <div>
              <dt>РљС–Р»СЊРєС–СЃС‚СЊ Р·Р°РґР°С‡</dt>
              <dd>{state.meta.numberOfTasks || "РќРµ РІРєР°Р·Р°РЅРѕ"}</dd>
            </div>
            <div>
              <dt>РўРёРї С‚РµСЃС‚Сѓ</dt>
              <dd>
                {state.meta.typeTest === "retaking"
                  ? "РџРµСЂРµР·РґР°С‡Р°"
                  : "РћСЃРЅРѕРІРЅРёР№"}
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <VariantMetaForm
          values={state.meta}
          isSubmitting={state.status === "creating"}
          errorMessage={state.errorMessage}
          onChange={patchMeta}
          onSubmit={handleSubmitMeta}
        />
      )}

      {state.taskItems.length > 0 && (
        <>
          <VariantTaskGrid
            tasks={state.taskItems}
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
