import CreatorTask from "./creatorTask";
import { useState } from "react";

interface Task {
  numberTask: string;
  typeTask: string | undefined;
  taskIsAdded: boolean;
}
type Tasks = Task[];
//ФОРМА ДЛЯ СТВОРЕННЯ ВАРІАНТУ
const CreatorNewVariant = (props: {
  nameVariant: string;
  tasks: Tasks;
  typeTest: string;
  updateTypeOfTask: (
    numTask: number,
    event: React.FormEvent<HTMLFormElement>
  ) => void;
  updateTaskIsAdded: (numTask: number, isAdded: boolean) => void;
}) => {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const handleClick = (item: number) => {
    // item - номер завдання (1,2,3,4...)
    setSelectedTask(item);
  };
  console.log(props.tasks);

  return (
    <div className="creator_new_variant">
      <p>Додайте завдання до вашого варіанту</p>
      <div className="box_for_numbers_of task">
        {props.tasks.length < 30 &&
          props.tasks.map((_, index) => (
            <div
              key={index + 1}
              className={`number_of_task ${
                props.tasks[index].taskIsAdded
                  ? "bg-green-200"
                  : "bg-neutral-100"
              } ${
                (selectedTask ?? 0) - 1 === index
                  ? "border-2 border-black"
                  : "border-1 border-gray-500"
              }`}
              onClick={() => handleClick(+props.tasks[index].numberTask)}
            >
              <p>{props.tasks[index].numberTask}</p>
            </div>
          ))}
      </div>
      {selectedTask && !props.tasks[selectedTask - 1].taskIsAdded && (
        <CreatorTask
          typeTest={props.typeTest}
          nameOfVarint={props.nameVariant}
          numSelectedTask={selectedTask?.toString()} // number-№завдання від 1,2,3..
          typeOfTasks={props.tasks[selectedTask - 1].typeTask}
          updateTypeOfTask={props.updateTypeOfTask}
          updateTaskIsAdded={props.updateTaskIsAdded}
          taskIsAdded={props.tasks[selectedTask - 1].taskIsAdded}
        ></CreatorTask>
      )}
      {selectedTask && props.tasks[selectedTask - 1].taskIsAdded && (
        <div className="task_is_added">
          <p>TASK #{selectedTask} IS ADDED</p>
        </div>
      )}
    </div>
  );
};
export default CreatorNewVariant;
