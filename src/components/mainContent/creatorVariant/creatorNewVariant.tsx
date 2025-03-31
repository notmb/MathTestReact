import CreatorTask from "./creatorTask";
import { useState } from "react";
//ФОРМА ДЛЯ СТВОРЕННЯ ВАРІАНТУ
const CreatorNewVariant = (props: {
  namberTask: string;
  nameVariant: string;
}) => {
  const [selectedTask, setSelectedTask] = useState<Number | null>(null);

  const numberOfTasks = Array.from(
    { length: +props.namberTask },
    (_, index) => index + 1
  );
  const handleClick = (index: number) => {
    setSelectedTask(index + 1);
  };

  const [typeTasks, setTypeTasks] = useState<string[]>(
    Array(+props.namberTask).fill(undefined)
  );
  //встановлюємо тип завдання
  const SetTypeTask = (
    event: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputValue = formData.get(`typeOfTask-${index}`);
    setTypeTasks((prev) => {
      const newTasks = [...prev]; // Копіюємо масив
      newTasks[index - 1] = inputValue as string; // Змінюємо значення конкретного елемента
      return newTasks; // Повертаємо новий масив
    });
    console.log(typeTasks);
  };

  return (
    <div className="creator_new_variant">
      <p>Додайте завдання до вашого варіанту</p>
      <div className="box_for_numbers_of task">
        {numberOfTasks.length < 30 &&
          numberOfTasks.map((item, index) => (
            <div
              key={index + 1}
              className="number_of_task"
              onClick={() => handleClick(index)}
            >
              {item}
            </div>
          ))}
      </div>
      {selectedTask && (
        <CreatorTask
          nameOfVarint={props.nameVariant}
          number={selectedTask?.toString()}
          SetTypeTask={SetTypeTask}
          typeOfTasks={typeTasks}
        ></CreatorTask>
      )}
    </div>
  );
};
export default CreatorNewVariant;
