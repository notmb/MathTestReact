import { useVariantContext } from "./variantContext";

import CreatorTaskChoice from "../creatorVariant/creatorTaskChoice";
import CreatorTaskMatching from "../creatorVariant/creatorTaskMatching";
import CreatorTaskOpenAnswer from "../creatorVariant/creatorTaskOpenAnswer";
const TaskEditor = (props: {
  numTask: string;
  selectedVariant: string;
  onSuccess: () => void;
}) => {
  const { tasks } = useVariantContext();
  return (
    <div>
      {tasks[props.numTask].typeOfTask === "choice" && (
        <CreatorTaskChoice
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant}
          updateTaskIsAdded={() => {}}
          onSuccess={props.onSuccess}
        ></CreatorTaskChoice>
      )}
      {tasks[props.numTask].typeOfTask === "comparison" && (
        <CreatorTaskMatching
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant}
          updateTaskIsAdded={() => {}}
          onSuccess={props.onSuccess}
        ></CreatorTaskMatching>
      )}
      {tasks[props.numTask].typeOfTask === "openAnswer" && (
        <CreatorTaskOpenAnswer
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant}
          updateTaskIsAdded={() => {}}
          onSuccess={props.onSuccess}
        ></CreatorTaskOpenAnswer>
      )}
    </div>
  );
};
export default TaskEditor;
