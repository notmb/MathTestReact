import CreatorTask from "./creatorTask";
import { useState } from "react";
import type { TaskType } from "../types";

interface Task {
  numberTask: string;
  typeTask: TaskType | undefined;
  taskIsAdded: boolean;
}
type Tasks = Task[];
//Р¤РћР РњРђ Р”Р›РЇ РЎРўР’РћР Р•РќРќРЇ Р’РђР Р†РђРќРўРЈ
const CreatorNewVariant = (props: {
  nameVariant: string; // Id
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
    // item - РЅРѕРјРµСЂ Р·Р°РІРґР°РЅРЅСЏ (1,2,3,4...)
    setSelectedTask(item);
  };
  console.log(props.tasks);

  return (
    <div className="creator_new_variant">
      <p>Р”РѕРґР°Р№С‚Рµ Р·Р°РІРґР°РЅРЅСЏ РґРѕ РІР°С€РѕРіРѕ РІР°СЂС–Р°РЅС‚Сѓ</p>
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
          numSelectedTask={selectedTask?.toString()} // number-в„–Р·Р°РІРґР°РЅРЅСЏ РІС–Рґ 1,2,3..
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

