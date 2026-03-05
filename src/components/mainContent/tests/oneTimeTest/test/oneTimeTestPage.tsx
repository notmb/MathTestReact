import "../styleOneTime.css";
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
    finalResult,
    isFinishDisabled,
    handleAnswersChange,
    handleFinish,
  } = useOneTimeTestFlow();

  const EMPTY_TASKS = {};

  return (
    <div className="one-time-test-page">
      <div className="one-time-test-fixed-meta">
        <p className="one-time-test-phase">{status.phase}</p>
        {status.phase === "running" && <Timer endAtMs={status.endAtMs} />}
      </div>

      <div className="one-time-test-header">
        <h4 className="one-time-test-title">{variantMeta?.variantName}</h4>
      </div>

      {status.phase === "invalid" && (
        <div className="one-time-test-status one-time-test-status_invalid">
          Некоректне посилання: {status.reason}
        </div>
      )}
      {status.phase === "blocked" && (
        <div className="one-time-test-status one-time-test-status_blocked">
          {getReasonMessage(status.reason)}
        </div>
      )}

      {status.phase === "running" && (
        <div className="one-time-test-running">
          <TaskList
            tasks={localTasks || EMPTY_TASKS}
            selectedVariant={status.variantId}
            initialAnswers={userAnswers}
            onAnswersChange={handleAnswersChange}
          ></TaskList>
        </div>
      )}
      {status.phase === "running" && (
        <div className="one-time-test-actions">
          <button
            type="button"
            className="custom_button one-time-test-finish"
            onClick={handleFinish}
            disabled={isFinishDisabled}
          >
            Завершити
          </button>
        </div>
      )}
      {status.phase === "finalizing" && (
        <div className="one-time-test-status one-time-test-status_progress">
          Зберігаємо результат...
        </div>
      )}
      {status.phase === "done" && (
        <div className="one-time-test-status one-time-test-status_done">
          <div>Готово</div>
          {finalResult && (
            <div className="one-time-test-final-result">
              Ваш результат: {finalResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OneTimeTest;
