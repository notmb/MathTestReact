import { useVariantContext } from "./variantContext";

import CreatorTaskChoice from "../creatorVariant/creatorTaskChoice";
import CreatorTaskMatching from "../creatorVariant/creatorTaskMatching";
import CreatorTaskOpenAnswer from "../creatorVariant/creatorTaskOpenAnswer";
const TaskEditor = (props: { numTask: string; selectedVariant: string }) => {
  const { tasks } = useVariantContext();
  return (
    <div>
      {tasks[props.numTask].typeOfTask === "choice" && (
        <CreatorTaskChoice
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant}
          updateTaskIsAdded={() => {}}
        ></CreatorTaskChoice>
      )}
      {tasks[props.numTask].typeOfTask === "comparison" && (
        <CreatorTaskMatching
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant}
          updateTaskIsAdded={() => {}}
        ></CreatorTaskMatching>
      )}
      {tasks[props.numTask].typeOfTask === "openAnswer" && (
        <CreatorTaskOpenAnswer
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant}
          updateTaskIsAdded={() => {}}
        ></CreatorTaskOpenAnswer>
      )}
    </div>
  );
};
export default TaskEditor;
