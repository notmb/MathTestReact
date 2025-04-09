import "./addVariant2.css";
import InfoAboutNewVariant from "./infoAboutNewVariant";
import CreatorNewVariant from "./creatorNewVariant";
import { useState } from "react";
import { useImmer } from "use-immer";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Імпорт Firestore

interface MainDataAboutVariant {
  variantName: string;
  numberOfTask: string;
}
interface Task {
  numberTask: string;
  typeTask: string | undefined;
  taskIsAdded: boolean;
}
type Tasks = Task[];

const NewVariant = () => {
  const [mainDataAboutNewVariant, setmainDataAboutNewVariant] =
    useState<MainDataAboutVariant | null>(null);

  const [tasks, updateTasks] = useImmer<Tasks>([]);

  const initializeTasks = (count: number) => {
    updateTasks(() => {
      return Array.from({ length: count }, (_, index) => ({
        numberTask: (index + 1).toString(),
        typeTask: undefined,
        taskIsAdded: false,
      }));
    });
  };
  const updateTypeOfTask = (numTask: number, type: string) => {
    updateTasks((draft) => {
      draft[numTask - 1].typeTask = type;
    });
  };
  const updateTaskIsAdded = (numTask: number, isAdded: boolean) => {
    updateTasks((draft) => {
      draft[numTask].taskIsAdded = isAdded;
    });
  };
  const createVariant = async (
    variantId: string,
    name: string,
    numberOfTask: string
  ) => {
    try {
      const variantRef = doc(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        "Mix",
        variantId
      );
      await setDoc(variantRef, { name, numberOfTask });

      console.log("Тестовий варіант створено!");
    } catch (error) {
      console.error("Помилка створення:", error);
    }
  };

  const handleClickSet = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newVariantName = formData.get("variantName") as string;
    const newNum = formData.get("numberOfTasks") as string;
    const dataOfTask: MainDataAboutVariant = {
      variantName: newVariantName,
      numberOfTask: newNum,
    };
    setmainDataAboutNewVariant(dataOfTask);
    initializeTasks(+newNum);
    createVariant(
      dataOfTask.variantName,
      dataOfTask.variantName,
      dataOfTask.numberOfTask
    );
  };

  return (
    <div className="add_variant">
      <InfoAboutNewVariant
        handleClickSet={handleClickSet}
      ></InfoAboutNewVariant>

      {mainDataAboutNewVariant && (
        <CreatorNewVariant
          tasks={tasks}
          updateTypeOfTask={updateTypeOfTask}
          updateTaskIsAdded={updateTaskIsAdded}
          nameVariant={mainDataAboutNewVariant.variantName}
        ></CreatorNewVariant>
      )}
    </div>
  );
};
export default NewVariant;
