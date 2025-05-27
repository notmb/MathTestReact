import type { Tasks, Task1, Task2, Task3 } from "../creatorVariant/types";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { db } from "../../../firebaseConfig";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import MathTest from "./mathTests";

interface VaiantData {
  name: string;
  createdAt: Timestamp;
  numberOfTasks: string;
}

const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
const isTask2 = (task: any): task is Task2 => task.typeOfTask === "comparison";
const isTask3 = (task: any): task is Task3 => task.typeOfTask === "openAnswer";

const ContainerForMathTest = (props: {
  selectedVariant: string;
  endTest?: (
    userAnswers: { [key: string]: any },
    mark: string,
    pointsForTasks: { [key: string]: number },
    variantId: string,
    variantName: string
  ) => void;
}) => {
  const [tasks, updateTasks] = useImmer<Tasks>({});

  const [dataVariant, updateDataVariant] = useImmer<VaiantData>({
    name: "",
    createdAt: new Timestamp(0, 0), // або новий Timestamp
    numberOfTasks: "",
  });

  const fetchVariantData = async () => {
    const docRef = doc(
      db,
      "Subjects",
      "Math",
      "Algebra",
      "Topics",
      "Mix",
      props.selectedVariant
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as VaiantData;
      updateDataVariant(() => {
        return data;
      });
    } else {
      console.warn("Документ не знайдено");
    }
  };

  const fetchTasks = async () => {
    try {
      const tasksCollectionRef = collection(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        "Mix",
        props.selectedVariant,
        "tasks"
      );

      const snapshot = await getDocs(tasksCollectionRef);
      const loadedTasks: Tasks = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (isTask1(data)) {
          loadedTasks[doc.id] = data as Task1;
        } else if (isTask2(data)) {
          loadedTasks[doc.id] = data as Task2;
        } else if (isTask3(data)) {
          loadedTasks[doc.id] = data as Task3;
        } else {
          console.warn(`Невідомий тип завдання (ID: ${doc.id})`, data);
        }
      });

      updateTasks(() => loadedTasks);
    } catch (error) {
      console.error("Помилка при завантаженні завдань:", error);
    }
  };

  const endTest = (
    userAnswers: { [key: string]: any },
    mark: string,
    pointsForTasks: { [key: string]: number }
  ) => {
    if (props.endTest) {
      props.endTest(
        userAnswers,
        mark,
        pointsForTasks,
        props.selectedVariant,
        dataVariant.name
      );
    }
  };

  useEffect(() => {
    fetchVariantData();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <MathTest
        tasks={tasks}
        selectedVariant={props.selectedVariant}
        endTest={endTest}
      ></MathTest>
    </>
  );
};

export default ContainerForMathTest;
