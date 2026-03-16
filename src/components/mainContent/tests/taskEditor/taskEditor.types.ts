import type { SupportedTask } from "../taskGuards";

export type TaskEditorBaseProps = {
  numTask: string;
  selectedVariant: string;
  typeTest: string;
  onSuccess: () => void;
};

export type TaskEditorComponentProps<TTask extends SupportedTask> =
  TaskEditorBaseProps & {
    task: TTask;
  };
