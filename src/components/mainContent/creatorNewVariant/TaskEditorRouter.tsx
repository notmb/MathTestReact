import ChoiceTaskEditor from "./editors/ChoiceTaskEditor";
import ComparisonTaskEditor from "./editors/ComparisonTaskEditor";
import OpenAnswerTaskEditor from "./editors/OpenAnswerTaskEditor";
import type { TaskDraft } from "./model/types";

type TaskEditorRouterProps = {
  taskDraft: TaskDraft;
};

const TaskEditorRouter = ({ taskDraft }: TaskEditorRouterProps) => {
  switch (taskDraft.type) {
    case "choice":
      return <ChoiceTaskEditor taskDraft={taskDraft} />;
    case "comparison":
      return <ComparisonTaskEditor taskDraft={taskDraft} />;
    case "openAnswer":
      return <OpenAnswerTaskEditor taskDraft={taskDraft} />;
    default:
      return <p>Select a task type to start editing task #{taskDraft.numberTask}.</p>;
  }
};

export default TaskEditorRouter;
