import TaskList from "./components/tasksList";
import Timer from "./components/timer";
import { useOneTimeTestFlow } from "./hooks/useOneTimeTestFlow";
import { getReasonMessage } from "./utils/oneTimeTestMessages";

const OneTimeTest = () => {
  const {
    status,
    variantMeta,
    localTasks,
    userAnswers,
    storageKey,
    isFinishDisabled,
    handleAnswersChange,
    handleFinish,
  } = useOneTimeTestFlow();

  const EMPTY_TASKS = {};

  return (
    <div>
      <h4>OneTimeTest</h4>
      <p>{status.phase}</p>

      {status.phase === "invalid" && (
        <div>Некоректне посилання: {status.reason}</div>
      )}
      {status.phase === "blocked" && (
        <div>{getReasonMessage(status.reason)}</div>
      )}

      {status.phase === "running" && (
        <div>
          <Timer endAtMs={status.endAtMs} />
          <TaskList
            tasks={localTasks || EMPTY_TASKS}
            selectedVariant={variantMeta?.variantName || ""}
            initialAnswers={userAnswers}
            onAnswersChange={handleAnswersChange}
          ></TaskList>
        </div>
      )}
      {status.phase === "running" && (
        <button
          type="button"
          className="custom_button"
          onClick={handleFinish}
          disabled={isFinishDisabled}
        >
          Завершити
        </button>
      )}
      {status.phase === "finalizing" && <div>Зберігаємо результат...</div>}
      {status.phase === "done" && <div>Готово ✅</div>}
    </div>
  );
};

export default OneTimeTest;
