import {
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { db } from "../../../firebaseConfig";
import { Task1, Task2, Task3, Tasks, VaiantData } from "../types";
import { VariantContext } from "./variantContext";
import { isTask1, isTask2, isTask3 } from "./taskGuards";

const VariantContextWrapper = (props: {
  variant: string;
  typeTest: string;
  children: React.ReactNode;
}) => {
  const [tasks, updateTasks] = useImmer<Tasks>({});
  const [dataVariant, updateDataVariant] = useImmer<VaiantData>({
    id: props.variant,
    typeTest: props.typeTest,
    variantName: "",
    createdAt: new Timestamp(0, 0),
    numberOfTasks: "",
    variantSerialNumber: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchVariantContent = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      updateTasks(() => ({}));
      updateDataVariant(() => ({
        id: props.variant,
        typeTest: props.typeTest,
        variantName: "",
        createdAt: new Timestamp(0, 0),
        numberOfTasks: "",
        variantSerialNumber: "",
      }));

      try {
        const topicName = props.typeTest === "main" ? "Mix" : "Retaking";
        const docRef = doc(
          db,
          "Subjects",
          "Math",
          "Algebra",
          "Topics",
          topicName,
          props.variant,
        );
        const tasksRef = collection(
          db,
          "Subjects",
          "Math",
          "Algebra",
          "Topics",
          topicName,
          props.variant,
          "tasks",
        );

        const [docSnap, snapshot] = await Promise.all([
          getDoc(docRef),
          getDocs(tasksRef),
        ]);

        if (isCancelled) {
          return;
        }

        if (docSnap.exists()) {
          updateDataVariant(() => ({
            ...(docSnap.data() as VaiantData),
            id: props.variant,
            typeTest: props.typeTest,
          }));
        }

        const loaded: Tasks = {};
        snapshot.forEach((taskDoc) => {
          const data = taskDoc.data();
          if (isTask1(data)) loaded[taskDoc.id] = data as Task1;
          else if (isTask2(data)) loaded[taskDoc.id] = data as Task2;
          else if (isTask3(data)) loaded[taskDoc.id] = data as Task3;
        });
        updateTasks(() => loaded);
      } catch (error) {
        console.error("Помилка при завантаженні вибраного тесту:", error);
        if (!isCancelled) {
          setErrorMessage("Не вдалося завантажити вибраний тест.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchVariantContent();

    return () => {
      isCancelled = true;
    };
  }, [props.typeTest, props.variant, updateDataVariant, updateTasks]);

  const updateTask = (numTask: string, updatedTask: Task1 | Task2 | Task3) => {
    updateTasks((draft) => {
      draft[numTask] = updatedTask;
    });
  };

  return (
    <VariantContext.Provider
      value={{ tasks, dataVariant, isLoading, errorMessage, updateTask }}
    >
      {props.children}
    </VariantContext.Provider>
  );
};

export default VariantContextWrapper;
