import Task from "../elementsForReviewTest/conditionOfTask";
import Answers from "../elementsForReviewTest/answersForTaskChoise";
import ComparisonData from "../elementsForReviewTest/comparison";
import { isTask1, isTask2, isTask3 } from "../taskGuards";
import { useVariantContext } from "../variantContext";

type UserAnswerValue = string | Record<string, string> | null | undefined;

const formatComparisonAnswer = (value: Record<string, string>) =>
  Object.entries(value)
    .map(([key, answer]) => `${key}-${answer}`)
    .join("; ");

const renderUserAnswer = (answer: UserAnswerValue) => {
  if (answer == null) {
    return <p>-</p>;
  }

  if (typeof answer === "string") {
    return <p>{answer}</p>;
  }

  return <p>{formatComparisonAnswer(answer)}</p>;
};

const getUserAnswerText = (answer: UserAnswerValue) => {
  if (answer == null) {
    return "-";
  }

  if (typeof answer === "string") {
    return answer;
  }

  return formatComparisonAnswer(answer);
};

const isCorrectComparisonAnswer = (
  answer: UserAnswerValue,
  correctComparison: Record<string, string>,
) => {
  if (!answer || typeof answer !== "object") {
    return false;
  }

  const correctEntries = Object.entries(correctComparison);
  if (Object.keys(answer).length !== correctEntries.length) {
    return false;
  }

  return correctEntries.every(([key, value]) => answer[key] === value);
};

const getAnswerStateClass = (task: unknown, answer: UserAnswerValue) => {
  if (answer == null) {
    return "test-results-sticky-answer-item-incorrect";
  }

  if (isTask1(task) || isTask3(task)) {
    return answer === task.correctAnswer
      ? "test-results-sticky-answer-item-correct"
      : "test-results-sticky-answer-item-incorrect";
  }

  if (isTask2(task)) {
    return isCorrectComparisonAnswer(answer, task.correctComparison)
      ? "test-results-sticky-answer-item-correct"
      : "test-results-sticky-answer-item-incorrect";
  }

  return "";
};

const TestResultsReview = (props: {
  selectedVariant: string;
  userAnswers: Record<string, UserAnswerValue>;
  nameStudent?: string;
}) => {
  const { tasks } = useVariantContext();

  if (!tasks || Object.keys(tasks).length === 0) {
    return <p>Немає завдань для відображення.</p>;
  }

  return (
    <div className="test-results-review">
      <section className="test-results-sticky-answers">
        <div className="test-results-sticky-answers-head">
          <h2 className="test-results-sticky-answers-title">Відповіді учня</h2>
        </div>

        <div className="test-results-sticky-answers-grid">
          {Object.entries(tasks).map(([key, task]) => {
            const userAnswer = props.userAnswers[key];

            return (
              <div
                key={key}
                className={`test-results-sticky-answer-item ${getAnswerStateClass(task, userAnswer)}`}
              >
                <span className="test-results-sticky-answer-key">{key}</span>
                <span className="test-results-sticky-answer-value">
                  {getUserAnswerText(userAnswer)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="test-results-review-body">
        <h2 className="test-results-review-title">Огляд завдань</h2>

        {Object.entries(tasks).map(([key, task]) => {
          const userAnswer = props.userAnswers[key];

          return (
            <article key={key} className="test-results-task-card">
              <div className="test-results-task-card-header">
                <p className="test-results-task-card-title">Завдання {key}</p>
              </div>

              <div className="test-results-task-card-body">
                <Task
                  selectedVariant={props.selectedVariant}
                  text={task.task.text}
                  picture={task.task.picture}
                  list={task.task.list}
                  table={task.task.table}
                />

                {isTask1(task) && (
                  <div className="test-results-task-section">
                    <Answers
                      selectedVariant={props.selectedVariant}
                      answers={task.answers}
                    />
                    <div className="test-results-answer-summary">
                      <p className="test-results-answer-line">
                        <strong>Правильна відповідь:</strong>{" "}
                        {task.correctAnswer}
                      </p>
                      <div className="test-results-answer-line">
                        <strong>Відповідь учня:</strong>
                        {renderUserAnswer(userAnswer)}
                      </div>
                    </div>
                  </div>
                )}

                {isTask2(task) && (
                  <div className="test-results-task-section">
                    <ComparisonData
                      selectedVariant={props.selectedVariant}
                      comparisonTable={task.comparisonTable}
                    />
                    <div className="test-results-answer-summary">
                      <p className="test-results-answer-line">
                        <strong>Правильна відповідь:</strong>{" "}
                        {formatComparisonAnswer(task.correctComparison)}
                      </p>
                      <div className="test-results-answer-line">
                        <strong>Відповідь учня:</strong>
                        {renderUserAnswer(userAnswer)}
                      </div>
                    </div>
                  </div>
                )}

                {isTask3(task) && (
                  <div className="test-results-answer-summary">
                    <p className="test-results-answer-line">
                      <strong>Правильна відповідь:</strong> {task.correctAnswer}
                    </p>
                    <div className="test-results-answer-line">
                      <strong>Відповідь учня:</strong>
                      {renderUserAnswer(userAnswer)}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default TestResultsReview;
