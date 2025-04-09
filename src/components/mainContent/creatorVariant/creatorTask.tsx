import ChoosingTypeTask from "./choosingTaskType";
import CreatorTaskChoice from "./creatorTaskChoice";
import CreatorTaskMatching from "./creatorTaskMatching";
import CreatorTaskOpenAnswer from "./creatorTaskOpenAnswer";

//ФОРМА ДЛЯ СТВОРЕННЯ ЗАВДАННЯ
const CreatorTask = (props: {
  nameOfVarint: string;
  numTask: string;
  setTypeTask: (event: React.FormEvent<HTMLFormElement>, index: number) => void;
  updateTaskIsAdded: (numTask: number, isAdded: boolean) => void;
  taskIsAdded: boolean;
  typeOfTasks: string | undefined;
}) => {
  return (
    <div className="creator_task">
      <ChoosingTypeTask
        number={props.numTask}
        setTypeTask={props.setTypeTask}
      ></ChoosingTypeTask>
      {props.typeOfTasks === "choice" && (
        <CreatorTaskChoice
          numTask={props.numTask}
          nameOfVariant={props.nameOfVarint}
          updateTaskIsAdded={props.updateTaskIsAdded}
        ></CreatorTaskChoice>
      )}
      {props.typeOfTasks === "comparison" && (
        <CreatorTaskMatching
          numTask={props.numTask}
          nameOfVariant={props.nameOfVarint}
        ></CreatorTaskMatching>
      )}
      {props.typeOfTasks === "openAnswer" && (
        <CreatorTaskOpenAnswer
          numTask={props.numTask}
          nameOfVariant={props.nameOfVarint}
        ></CreatorTaskOpenAnswer>
      )}
    </div>
  );
};
export default CreatorTask;
