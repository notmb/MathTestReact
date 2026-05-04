import TaskList from "../../oneTimeTest/test/components/tasksList";
import "../../oneTimeTest/styleOneTime.css";
import type { Tasks, VaiantData } from "../localMathTest.types";
import type { UserAnswersState } from "../../oneTimeTest/test/oneTimeTest.types";
import { buildResultDetails } from "../../oneTimeTest/test/utils/oneTimeTestScoring";
import { useState } from "react";
type LocalMathTestProps = {
  tasks: Tasks;
  dataVariant: VaiantData;
};
const LocalMathTest = ({ tasks, dataVariant }: LocalMathTestProps) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswersState>({});

  const handleFinish = () => {
    const resultDetails = buildResultDetails(tasks, userAnswers);
    alert(resultDetails.result);
  };

  return (
    <div className="local-test">
      <h3 className="local-test-title">{dataVariant.variantName}</h3>
      <TaskList
        tasks={tasks}
        selectedVariant={dataVariant.id}
        initialAnswers={userAnswers}
        onAnswersChange={setUserAnswers}
      ></TaskList>
      <div className="local-task-actions">
        <button
          type="button"
          className="custom-button btn-edd-local-test"
          onClick={handleFinish}
        >
          Завершити тест
        </button>
      </div>
    </div>
  );
};
export default LocalMathTest;
