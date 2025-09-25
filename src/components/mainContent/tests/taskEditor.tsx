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

  const typeTest = props.selectedVariant.slice(-1) === "M" ? "Mix" : "Retaking";
  console.log(typeTest);
  return (
    <div>
      {tasks[props.numTask].typeOfTask === "choice" && (
        <CreatorTaskChoice
          typeTest={typeTest}
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant.slice(0, -1)}
          updateTaskIsAdded={() => {}}
          onSuccess={props.onSuccess}
        ></CreatorTaskChoice>
      )}
      {tasks[props.numTask].typeOfTask === "comparison" && (
        <CreatorTaskMatching
          typeTest={typeTest}
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant.slice(0, -1)}
          updateTaskIsAdded={() => {}}
          onSuccess={props.onSuccess}
        ></CreatorTaskMatching>
      )}
      {tasks[props.numTask].typeOfTask === "openAnswer" && (
        <CreatorTaskOpenAnswer
          typeTest={typeTest}
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant.slice(0, -1)}
          updateTaskIsAdded={() => {}}
          onSuccess={props.onSuccess}
        ></CreatorTaskOpenAnswer>
      )}
    </div>
  );
};
export default TaskEditor;
