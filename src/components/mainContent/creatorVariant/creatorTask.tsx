import ChoosingTypeTask from "./choosingTaskType";
import CreatorTaskChoice from "./creatorTaskChoice";
import CreatorTaskMatching from "./creatorTaskMatching";
import CreatorTaskOpenAnswer from "./creatorTaskOpenAnswer";
import type { TaskType } from "../types";

//Р¤РћР РњРђ Р”Р›РЇ РЎРўР’РћР Р•РќРќРЇ Р—РђР’Р”РђРќРќРЇ
const CreatorTask = (props: {
  typeTest: string;
  nameOfVarint: string;
  numSelectedTask: string;
  updateTypeOfTask: (
    numTask: number,
    event: React.FormEvent<HTMLFormElement>
  ) => void;
  updateTaskIsAdded: (numTask: number, isAdded: boolean) => void;
  taskIsAdded: boolean;
  typeOfTasks: TaskType | undefined;
}) => {
  return (
    <div className="creator_task">
      <ChoosingTypeTask
        numSelectedTask={props.numSelectedTask}
        setTypeTask={props.updateTypeOfTask}
      ></ChoosingTypeTask>
      {props.typeOfTasks === "choice" && (
        <CreatorTaskChoice
          typeTest={props.typeTest}
          numSelectedTask={props.numSelectedTask}
          nameOfVariant={props.nameOfVarint}
          updateTaskIsAdded={props.updateTaskIsAdded}
        ></CreatorTaskChoice>
      )}
      {props.typeOfTasks === "comparison" && (
        <CreatorTaskMatching
          typeTest={props.typeTest}
          numSelectedTask={props.numSelectedTask}
          nameOfVariant={props.nameOfVarint}
          updateTaskIsAdded={props.updateTaskIsAdded}
        ></CreatorTaskMatching>
      )}
      {props.typeOfTasks === "openAnswer" && (
        <CreatorTaskOpenAnswer
          typeTest={props.typeTest}
          numSelectedTask={props.numSelectedTask}
          nameOfVariant={props.nameOfVarint}
          updateTaskIsAdded={props.updateTaskIsAdded}
        ></CreatorTaskOpenAnswer>
      )}
    </div>
  );
};
export default CreatorTask;

