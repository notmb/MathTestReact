import "./addVariant2.css";
import InfoAboutNewVariant from "./infoAboutNewVariant";
import CreatorNewVariant from "./creatorNewVariant";
import { useState } from "react";
import { useImmer } from "use-immer";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import type { TaskType } from "../types";

type TestType = "main" | "retaking";

interface MainDataAboutVariant {
  variantName: string;
  numberOfTask: string;
  topic: string;
  typeTest: TestType;
}

interface Task {
  numberTask: string;
  typeTask: TaskType | undefined;
  taskIsAdded: boolean;
}

type Tasks = Task[];

const isTaskType = (value: string): value is TaskType =>
  value === "choice" || value === "comparison" || value === "openAnswer";

const AddNewVariant = () => {
  const [mainDataAboutNewVariant, setMainDataAboutNewVariant] =
    useState<MainDataAboutVariant | null>(null);

  const [id, setId] = useState<string>("");

  const [tasks, updateTasks] = useImmer<Tasks>([]);

  const testPathMap: Record<TestType, "Mix" | "Retaking"> = {
    main: "Mix",
    retaking: "Retaking",
  };

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
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputValue = formData.get(`typeOfTask-${numTask}`) as string;
    if (!isTaskType(inputValue)) return;

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
    variantSerialNumber: string,
    typeTest: TestType,
  ) => {
    const variantsCollectionRef = collection(
      db,
      "Subjects",
      "Math",
      "Algebra",
      "Topics",
      testPathMap[typeTest],
    );

    try {
      const docRef = await addDoc(variantsCollectionRef, {
        variantName: nameVariant,
        variantSerialNumber,
        numberOfTasks: numberOfTask,
        typeTest,
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
    const newVariantSerialNumber = formData.get("variantSerialNumber") as string;
    const typeTest = formData.get("typeTest") as TestType;

    const dataOfTask: MainDataAboutVariant = {
      variantName: newVariantName,
      numberOfTask: newNumOfTasks,
      topic: newVariantSerialNumber,
      typeTest,
    };

    setMainDataAboutNewVariant(dataOfTask);
    initializeTasks(+newNumOfTasks);
    createVariant(
      dataOfTask.variantName,
      dataOfTask.numberOfTask,
      dataOfTask.topic,
      dataOfTask.typeTest,
    );
  };

  return (
    <div className="add_variant">
      <InfoAboutNewVariant handleClickSet={handleClickSet}></InfoAboutNewVariant>

      {mainDataAboutNewVariant && (
        <CreatorNewVariant
          tasks={tasks}
          typeTest={mainDataAboutNewVariant.typeTest}
          updateTypeOfTask={updateTypeOfTask}
          updateTaskIsAdded={updateTaskIsAdded}
          nameVariant={id}
        ></CreatorNewVariant>
      )}
    </div>
  );
};

export default AddNewVariant;

