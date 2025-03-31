import ChoosingTypeTask from "./choosingTaskType";
import CreatorTaskChoice from "./creatorTaskChoice";
import CreatorTaskMatching from "./creatorTaskMatching";
import CreatorTaskOpenAnswer from "./creatorTaskOpenAnswer";

//ФОРМА ДЛЯ СТВОРЕННЯ ЗАВДАННЯ
const CreatorTask = (props: {
  nameOfVarint: string;
  number: string;
  SetTypeTask: (event: React.FormEvent<HTMLFormElement>, index: number) => void;
  typeOfTasks: string[];
}) => {
  return (
    <div className="creator_task">
      <ChoosingTypeTask
        number={props.number}
        SetTypeTask={props.SetTypeTask}
      ></ChoosingTypeTask>
      {props.typeOfTasks[+props.number - 1] === "choice" && (
        <CreatorTaskChoice
          numTask={props.number}
          nameOfVariant={props.nameOfVarint}
        ></CreatorTaskChoice>
      )}
      {props.typeOfTasks[+props.number - 1] === "comparison" && (
        <CreatorTaskMatching
          numTask={props.number}
          nameOfVariant={props.nameOfVarint}
        ></CreatorTaskMatching>
      )}
      {props.typeOfTasks[+props.number - 1] === "openAnswer" && (
        <CreatorTaskOpenAnswer
          numTask={props.number}
          nameOfVariant={props.nameOfVarint}
        ></CreatorTaskOpenAnswer>
      )}
    </div>
  );
};
export default CreatorTask;
