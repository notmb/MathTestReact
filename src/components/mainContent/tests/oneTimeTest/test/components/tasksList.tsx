import { useEffect, useMemo, useRef } from "react";
import { useImmer } from "use-immer";
import type { Task1, Task2, Task3 } from "../../../../types";
import { Tasks } from "../taskTypes/typeTasks";
import TaskChoice from "../taskTypes/taskChoice";
import TaskComparison from "../taskTypes/taskComparison";
import TaskOpenAnswer from "../taskTypes/taskOpenAnswer";

type TaskId = string;
type MatchingAnswer = Record<string, string>;
type UserAnswer = string | MatchingAnswer;
type UserAnswersState = Record<TaskId, UserAnswer>;

const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
const isTask2 = (task: any): task is Task2 => task.typeOfTask === "comparison";
const isTask3 = (task: any): task is Task3 => task.typeOfTask === "openAnswer";

const TaskList = (props: {
  tasks: Tasks;
  selectedVariant: string;
  initialAnswers?: Record<string, any>;
  onAnswersChange?: (answers: Record<string, any>) => void;
}) => {
  const [userAnswers, updateUserAnswers] = useImmer<UserAnswersState>({});
  const onAnswersChangeRef = useRef(props.onAnswersChange);
  const didHydrateFromInitialRef = useRef(false);

  onAnswersChangeRef.current = props.onAnswersChange;

  useEffect(() => {
    if (didHydrateFromInitialRef.current) return;
    const incoming = (props.initialAnswers ?? {}) as UserAnswersState;
    if (Object.keys(incoming).length === 0) return;
    updateUserAnswers(() => incoming);
    didHydrateFromInitialRef.current = true;
  }, [props.initialAnswers, updateUserAnswers]);

  useEffect(() => {
    onAnswersChangeRef.current?.(userAnswers);
  }, [userAnswers]);

  const orderedTasks = useMemo(
    () =>
      Object.entries(props.tasks).sort(
        ([a], [b]) => Number(a) - Number(b) || a.localeCompare(b),
      ),
    [props.tasks],
  );

  return (
    <div className="conteiner_for_test">
      <div className="tests">
        {orderedTasks.map(([taskId, task]) => (
          <div key={taskId}>
            {isTask1(task) && (
              <TaskChoice
                selectedVariant={props.selectedVariant}
                task={task.task}
                answers={task.answers}
                number={taskId}
                currentAnswer={
                  typeof userAnswers[taskId] === "string"
                    ? (userAnswers[taskId] as string)
                    : undefined
                }
                updateUserAnswer={(id, answer) =>
                  updateUserAnswers((draft) => {
                    draft[id] = answer;
                  })
                }
              />
            )}

            {isTask2(task) && (
              <TaskComparison
                selectedVariant={props.selectedVariant}
                task={task.task}
                comparisonTable={task.comparisonTable}
                number={taskId}
                currentAnswer={
                  typeof userAnswers[taskId] === "object" &&
                  userAnswers[taskId] !== null
                    ? (userAnswers[taskId] as Record<string, string>)
                    : undefined
                }
                updateUserAnswer={(answer) =>
                  updateUserAnswers((draft) => {
                    draft[taskId] = answer;
                  })
                }
              />
            )}

            {isTask3(task) && (
              <TaskOpenAnswer
                selectedVariant={props.selectedVariant}
                task={task.task}
                number={taskId}
                currentAnswer={
                  typeof userAnswers[taskId] === "string"
                    ? (userAnswers[taskId] as string)
                    : undefined
                }
                updateUserAnswer={(id, answer) =>
                  updateUserAnswers((draft) => {
                    draft[id] = answer;
                  })
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
