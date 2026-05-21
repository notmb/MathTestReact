import { useEffect, useMemo, useState } from "react";
import TaskEditorRouter from "./TaskEditorRouter";
import TaskTypeSelector from "./TaskTypeSelector";
import {
  VariantDraftProvider,
  useVariantDraftContext,
} from "./VariantDraftContext";
import { createEmptyTaskDraft } from "./model/factories";
import type { VariantType } from "./model/types";
import { useVariantContext } from "../tests/variantContext";
import type { TaskType } from "../types";

type AddTaskToVariantProps = {
  selectedVariant: string;
  onSuccess: () => void;
};

const AddTaskToVariantContent = ({
  selectedVariant,
  onSuccess,
}: AddTaskToVariantProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { dataVariant, tasks } = useVariantContext();
  const {
    state,
    patchMeta,
    setSelectedTaskNumber,
    setTaskItems,
    setTaskType,
  } = useVariantDraftContext();

  const nextTaskNumber = useMemo(
    () => String(Object.keys(tasks).length + 1),
    [tasks],
  );

  const typeTest: VariantType =
    dataVariant.typeTest === "retaking" ? "retaking" : "main";

  useEffect(() => {
    if (isInitialized) {
      return;
    }

    patchMeta({
      variantId: selectedVariant,
      typeTest,
    });
    setTaskItems([
      {
        numberTask: nextTaskNumber,
        taskIsAdded: false,
        typeTask: undefined,
      },
    ]);
    setSelectedTaskNumber(nextTaskNumber);
    setIsInitialized(true);
  }, [
    isInitialized,
    nextTaskNumber,
    patchMeta,
    selectedVariant,
    setSelectedTaskNumber,
    setTaskItems,
    typeTest,
  ]);

  const selectedTaskDraft =
    state.taskDrafts[nextTaskNumber] ?? createEmptyTaskDraft(nextTaskNumber);

  const selectedTaskType = selectedTaskDraft.type ?? "";

  useEffect(() => {
    if (selectedTaskDraft.status === "saved") {
      onSuccess();
    }
  }, [onSuccess, selectedTaskDraft.status]);

  const handleSelectTaskType = (taskType: TaskType) => {
    setTaskType(nextTaskNumber, taskType);
  };

  return (
    <section className="creator_new_variant add_task_to_variant">
      <TaskTypeSelector
        id={`add-task-type-${nextTaskNumber}`}
        value={selectedTaskType}
        onChange={handleSelectTaskType}
      />
      {selectedTaskDraft.type ? (
        <TaskEditorRouter taskDraft={selectedTaskDraft} />
      ) : (
        <p>Виберіть тип завдання, щоб додати його до тесту.</p>
      )}
    </section>
  );
};

const AddTaskToVariant = (props: AddTaskToVariantProps) => (
  <VariantDraftProvider>
    <AddTaskToVariantContent {...props} />
  </VariantDraftProvider>
);

export default AddTaskToVariant;
