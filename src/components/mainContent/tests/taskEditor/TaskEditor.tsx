import type { ComponentType } from "react";
import type { Task1, Task2, Task3 } from "../../types";
import type { SupportedTask } from "../taskGuards";
import { isTask1, isTask2, isTask3 } from "../taskGuards";
import { useVariantContext } from "../variantContext";
import EditChoiceTask from "./EditChoiceTask";
import EditComparisonTask from "./EditComparisonTask";
import EditOpenAnswerTask from "./EditOpenAnswerTask";
import "./taskEditor.css";
import type {
  TaskEditorBaseProps,
  TaskEditorComponentProps,
} from "./taskEditor.types";

type EditorMap = {
  choice: ComponentType<TaskEditorComponentProps<Task1>>;
  comparison: ComponentType<TaskEditorComponentProps<Task2>>;
  openAnswer: ComponentType<TaskEditorComponentProps<Task3>>;
};

const editorByType: EditorMap = {
  choice: EditChoiceTask,
  comparison: EditComparisonTask,
  openAnswer: EditOpenAnswerTask,
};

const renderEditor = (task: SupportedTask, props: TaskEditorBaseProps) => {
  if (isTask1(task)) {
    const Editor = editorByType.choice;
    return <Editor {...props} task={task} />;
  }

  if (isTask2(task)) {
    const Editor = editorByType.comparison;
    return <Editor {...props} task={task} />;
  }

  if (isTask3(task)) {
    const Editor = editorByType.openAnswer;
    return <Editor {...props} task={task} />;
  }

  return null;
};

const TaskEditor = (props: {
  numTask: string;
  selectedVariant: string;
  onSuccess: () => void;
}) => {
  const { tasks, dataVariant } = useVariantContext();
  const task = tasks[props.numTask];
  const typeTest = dataVariant.typeTest || "main";

  if (!task) {
    return (
      <div className="task-editor-shell">
        <p>Не вдалося знайти завдання для редагування.</p>
      </div>
    );
  }

  return (
    <div className="task-editor-shell">
      {renderEditor(task, {
        numTask: props.numTask,
        selectedVariant: props.selectedVariant,
        typeTest,
        onSuccess: props.onSuccess,
      })}
    </div>
  );
};

export default TaskEditor;
