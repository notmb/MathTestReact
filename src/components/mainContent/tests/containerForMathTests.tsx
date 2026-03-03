import type { Tasks, Task1, Task2, Task3, VaiantData } from "../types";
import { useVariantContext } from "./variantContext";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { db } from "../../../firebaseConfig";
import {
  getDocs,
  collection,
  doc,
  Timestamp,
  getDoc,
} from "firebase/firestore";

import MathTest from "./mathTests";

type AnswerSingle = string;
type AnswerMulti = {
  [subTaskNumber: string]: string;
};

type UserAnswers = {
  [taskNumber: string]: AnswerSingle | AnswerMulti;
};

const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
const isTask2 = (task: any): task is Task2 => task.typeOfTask === "comparison";
const isTask3 = (task: any): task is Task3 => task.typeOfTask === "openAnswer";

const ContainerForMathTest = (props: {
  selectedVariant: string;
  startedAt?: Timestamp | null;
  endTest?: (
    userAnswers: UserAnswers,
    result: string,
    pointsForTasks: { [key: string]: number },
    variantId: string,
    variantSerialNumber: string,
    reason: "manual" | "timeOut",
  ) => void;
}) => {
  const { tasks, dataVariant } = useVariantContext();

  const [localTasks, updateLocalTasks] = useImmer<Tasks>({});

  const [localDataVariant, updateLocalDataVariant] =
    useImmer<VaiantData | null>(null);

  const pathMain = "Subjects/Math/Algebra/Topics/Mix";
  const pathRetaking = "Subjects/Math/Algebra/Topics/Retaking";

  const checkIfDocExists = async (collectionPath: string, docId: string) => {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        updateLocalDataVariant(() => docSnap.data() as VaiantData);
        console.log("Документ існує:", docSnap.data());
        return true;
      } else {
        console.log("Документ не існує");
        return false;
      }
    } catch (error) {
      console.error("Помилка перевірки існування документа:", error);

      return false;
    }
  };

  const loadTasks = async (link: string) => {
    try {
      const taskCollectionRef = collection(
        db,
        link,
        props.selectedVariant,
        "tasks",
      );
      const collSnap = await getDocs(taskCollectionRef);

      const loadedTasks: Tasks = {};

      collSnap.forEach((doc) => {
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
      updateLocalTasks(() => loadedTasks);
    } catch (error) {
      console.error("Помилка при завантаженні завдань:", error);
    }
  };

  const loadData = async (link: string) => {
    try {
      const docRef = doc(db, link, props.selectedVariant);
      const docSnap = await getDoc(docRef);

      const data = { ...docSnap.data(), id: docSnap.id } as VaiantData;

      updateLocalDataVariant(() => data);
    } catch (error) {
      console.error("Помилка при завантаженні завдань:", error);
    }
  };

  useEffect(() => {
    const checkAndLoad = async () => {
      if (Object.keys(tasks).length !== 0) {
        console.log("глобальний стейт існує");
        updateLocalTasks(() => tasks);
        updateLocalDataVariant(() => dataVariant);
      } else {
        console.log("глобальний стейт відсутній");
        const existsInMain = await checkIfDocExists(
          pathMain,
          props.selectedVariant,
        );

        if (existsInMain) {
          console.log("✅ Документ існує — завантажуємо з main");
          await loadTasks(pathMain);
          await loadData(pathMain);
        } else {
          const existsInRetaking = await checkIfDocExists(
            pathMain,
            props.selectedVariant,
          );
          if (existsInRetaking) {
            console.log("✅ Документ існує — завантажуємо з retaking");
            await loadTasks(pathRetaking);
            await loadData(pathRetaking);
          } else {
            console.log("❌ Документ відсутній ");
            // await loadTasks(pathRetaking);
            // await loadData(pathRetaking);
          }
        }
      }
    };

    checkAndLoad();
  }, [props.selectedVariant]);

  const endTest = (
    userAnswers: { [key: string]: any },
    mark: string,
    pointsForTasks: { [key: string]: number },
    reason: "manual" | "timeOut",
  ) => {
    console.log(props.endTest);
    if (props.endTest) {
      props.endTest(
        userAnswers,
        mark,
        pointsForTasks,
        props.selectedVariant,
        localDataVariant?.variantSerialNumber || "noNumber",
        reason,
      );
    }
  };

  return (
    <>
      {props.endTest && (
        <MathTest
          tasks={localTasks}
          selectedVariant={props.selectedVariant}
          startedAt={props.startedAt}
          endTest={endTest}
        ></MathTest>
      )}
      {!props.endTest && (
        <MathTest
          tasks={localTasks}
          selectedVariant={props.selectedVariant}
        ></MathTest>
      )}
    </>
  );
};

export default ContainerForMathTest;
