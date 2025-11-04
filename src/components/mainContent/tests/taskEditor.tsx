import { useVariantContext } from "../../../context/variantContext";

import CreatorTaskChoice from "../creatorVariant/creatorTaskChoice";
import CreatorTaskMatching from "../creatorVariant/creatorTaskMatching";
import CreatorTaskOpenAnswer from "../creatorVariant/creatorTaskOpenAnswer";
const TaskEditor = (props: {
  numTask: string;
  selectedVariant: string;
  onSuccess: () => void;
}) => {
  const { tasks, dataVariant } = useVariantContext();

  const typeTest = dataVariant.typeTest || "main";
  console.log(typeTest);
  console.log(props.selectedVariant);
  return (
    <div>
      {tasks[props.numTask].typeOfTask === "choice" && (
        <CreatorTaskChoice
          typeTest={typeTest}
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant}
          updateTaskIsAdded={() => {}}
          onSuccess={props.onSuccess}
        ></CreatorTaskChoice>
      )}
      {tasks[props.numTask].typeOfTask === "comparison" && (
        <CreatorTaskMatching
          typeTest={typeTest}
          numSelectedTask={props.numTask}
          nameOfVariant={props.selectedVariant}
          updateTaskIsAdded={() => {}}
          onSuccess={props.onSuccess}
        ></CreatorTaskMatching>
      )}
      {tasks[props.numTask].typeOfTask === "openAnswer" && (
        <CreatorTaskOpenAnswer
          typeTest={typeTest}
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
