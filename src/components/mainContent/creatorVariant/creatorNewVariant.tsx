import CreatorTask from "./creatorTask";
import { useState, useEffect } from "react";
import { useImmer } from "use-immer";

interface Task {
  numberTask: string;
  typeTask: string | undefined;
  taskIsAdded: boolean;
}
type Tasks = Task[];
//ФОРМА ДЛЯ СТВОРЕННЯ ВАРІАНТУ
const CreatorNewVariant = (props: {
  tasks: Tasks;
  updateTypeOfTask: (numTask: number, type: string) => void;
  updateTaskIsAdded: (numTask: number, isAdded: boolean) => void;
  nameVariant: string;
}) => {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  // console.log(props.namberTask);
  const handleClick = (item: number) => {
    // item - номер завдання (1,2,3,4...)
    setSelectedTask(item);
  };
  console.log(props.tasks);
  //встановлюємо тип завдання
  const setTypeTask = (
    event: React.FormEvent<HTMLFormElement>,
    numTask: number
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputValue = formData.get(`typeOfTask-${numTask}`) as string;
    props.updateTypeOfTask(numTask, inputValue);
  };

  return (
    <div className="creator_new_variant">
      <p>Додайте завдання до вашого варіанту</p>
      <div className="box_for_numbers_of task">
        {props.tasks.length < 30 &&
          props.tasks.map((item, index) => (
            <div
              key={index + 1}
              className={`number_of_task ${
                props.tasks[index].taskIsAdded
                  ? "bg-green-200"
                  : "bg-neutral-100"
              }`}
              onClick={() => handleClick(+props.tasks[index].numberTask)}
            >
              {props.tasks[index].numberTask}
            </div>
          ))}
      </div>
      {selectedTask && !props.tasks[selectedTask - 1].taskIsAdded && (
        <CreatorTask
          nameOfVarint={props.nameVariant}
          numTask={selectedTask?.toString()} // number-№завдання від 1,2,3..
          setTypeTask={setTypeTask}
          typeOfTasks={props.tasks[selectedTask - 1].typeTask}
          updateTaskIsAdded={props.updateTaskIsAdded}
          taskIsAdded={props.tasks[selectedTask - 1].taskIsAdded}
        ></CreatorTask>
      )}
      {selectedTask && props.tasks[selectedTask - 1].taskIsAdded && (
        <div>TASK #{selectedTask} IS ADDED</div>
      )}
    </div>
  );
};
export default CreatorNewVariant;
