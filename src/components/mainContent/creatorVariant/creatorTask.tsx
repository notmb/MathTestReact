import { useState } from "react";
import ChoosingTypeTask from "./choosingTaskType";
import CreatorTaskChoice from "./creatorTaskChoice";
import CreatorTaskMatching from "./creatorTaskMatching";
import CreatorTaskOpenAnswer from "./creatorTaskOpenAnswer";

//ФОРМА ДЛЯ СТВОРЕННЯ ЗАВДАННЯ
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
  typeOfTasks: string | undefined;
}) => {
  const partOfTheWay =
    props.typeTest === "main"
      ? "Mix"
      : props.typeTest === "retaking"
      ? "Retaking"
      : "";
  return (
    <div className="creator_task">
      <ChoosingTypeTask
        numSelectedTask={props.numSelectedTask}
        setTypeTask={props.updateTypeOfTask}
      ></ChoosingTypeTask>
      {props.typeOfTasks === "choice" && (
        <CreatorTaskChoice
          typeTest={partOfTheWay}
          numSelectedTask={props.numSelectedTask}
          nameOfVariant={props.nameOfVarint}
          updateTaskIsAdded={props.updateTaskIsAdded}
        ></CreatorTaskChoice>
      )}
      {props.typeOfTasks === "comparison" && (
        <CreatorTaskMatching
          typeTest={partOfTheWay}
          numSelectedTask={props.numSelectedTask}
          nameOfVariant={props.nameOfVarint}
          updateTaskIsAdded={props.updateTaskIsAdded}
        ></CreatorTaskMatching>
      )}
      {props.typeOfTasks === "openAnswer" && (
        <CreatorTaskOpenAnswer
          typeTest={partOfTheWay}
          numSelectedTask={props.numSelectedTask}
          nameOfVariant={props.nameOfVarint}
          updateTaskIsAdded={props.updateTaskIsAdded}
        ></CreatorTaskOpenAnswer>
      )}
    </div>
  );
};
export default CreatorTask;
