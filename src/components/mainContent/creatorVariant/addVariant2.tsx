import "./addVariant2.css";
import InfoAboutNewVariant from "./infoAboutNewVariant";
import CreatorNewVariant from "./creatorNewVariant";
import { useState } from "react";
import { useImmer } from "use-immer";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Імпорт Firestore

interface MainDataAboutVariant {
  variantName: string;
  numberOfTask: string;
  variantSerialNumber: string;
}
interface Task {
  numberTask: string;
  typeTask: string | undefined;
  taskIsAdded: boolean;
}
type Tasks = Task[];

const AddNewVariant = () => {
  const [mainDataAboutNewVariant, setMainDataAboutNewVariant] =
    useState<MainDataAboutVariant | null>(null);

  const [id, setId] = useState<string>("");

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
  const updateTypeOfTask = (
    numTask: number,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputValue = formData.get(`typeOfTask-${numTask}`) as string;
    updateTasks((draft) => {
      draft[numTask - 1].typeTask = inputValue;
    });
  };
  const updateTaskIsAdded = (numTask: number, isAdded: boolean) => {
    updateTasks((draft) => {
      draft[numTask].taskIsAdded = isAdded;
    });
  };

  const createVariant = async (
    nameVariant: string,
    numberOfTask: string,
    variantSerialNumber: string
  ) => {
    const variantsCollectionRef = collection(
      db,
      "Subjects",
      "Math",
      "Algebra",
      "Topics",
      "Mix"
    );
    try {
      const docRef = await addDoc(variantsCollectionRef, {
        name: nameVariant,
        variantSerialNumber: variantSerialNumber,
        numberOfTasks: numberOfTask,
        createdAt: new Date(),
      });
      console.log("Тестовий варіант створено!");
      setId(docRef.id);
    } catch (error) {
      console.error("Помилка створення:", error);
    }
  };

  const handleClickSet = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newVariantName = formData.get("variantName") as string;
    const newNumOfTasks = formData.get("numberOfTasks") as string;
    const newVariantSerialNumber = formData.get(
      "variantSerialNumber"
    ) as string;
    const dataOfTask: MainDataAboutVariant = {
      variantName: newVariantName,
      numberOfTask: newNumOfTasks,
      variantSerialNumber: newVariantSerialNumber,
    };
    setMainDataAboutNewVariant(dataOfTask);
    initializeTasks(+newNumOfTasks);
    createVariant(
      dataOfTask.variantName,
      dataOfTask.numberOfTask,
      dataOfTask.variantSerialNumber
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
          nameVariant={id}
        ></CreatorNewVariant>
      )}
    </div>
  );
};
export default AddNewVariant;
