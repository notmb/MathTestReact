import TestReview from "./elementsForReviewTest/testReview";
import { useState, useEffect } from "react";
import { VariantContext } from "./variantContext";
import { useImmer } from "use-immer";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import type {
  VaiantData,
  Tasks,
  Task1,
  Task2,
  Task3,
} from "../creatorVariant/types";

const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
const isTask2 = (task: any): task is Task2 => task.typeOfTask === "comparison";
const isTask3 = (task: any): task is Task3 => task.typeOfTask === "openAnswer";

const SelectedVariant = (props: {
  selectedVariant: string;
  navigate: (path: string) => void;
}) => {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  //
  //
  //
  //

  const [tasks, updateTasks] = useImmer<Tasks>({});
  const [dataVariant, updateDataVariant] = useImmer<VaiantData>({
    id: "",
    name: "",
    createdAt: new Timestamp(0, 0),
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
      updateDataVariant(() => data);
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
  useEffect(() => {
    fetchVariantData();
    fetchTasks();
  }, []);

  //
  //
  //
  //
  //

  const handlePassTheTest = (nameTest: string) => {
    props.navigate(`/MathTestReact/allTest/selectedVariant/${nameTest}/test`);
  };

  const handleOneTimePassTheTest = (nameTest: string) => {
    props.navigate(
      `/MathTestReact/allTest/selectedVariant/${nameTest}/one-time-links`
    );
  };

  const removeTest = async (link: string) => {
    await deleteDoc(
      doc(db, "Subjects", "Math", "Algebra", "Topics", "Mix", link)
    );
    setIsDelete(true);
  };

  return (
    <div className="container_for_selected_test">
      {isDelete === false && (
        <VariantContext.Provider value={{ tasks, dataVariant }}>
          <div className="selected_test">
            <div className="buttons">
              <div className="left_side">
                <button className="custom_button">Редагувати</button>
                <button className="custom_button">Переіменувати</button>
                <button
                  className="custom_button"
                  onClick={() => removeTest(props.selectedVariant)}
                >
                  Видалити
                </button>
                <button
                  className="custom_button"
                  onClick={() =>
                    handleOneTimePassTheTest(props.selectedVariant)
                  }
                >
                  Одноразові посилання
                </button>
              </div>
              <div className="right_side">
                <button
                  className="custom_button"
                  onClick={() => handlePassTheTest(props.selectedVariant)}
                >
                  Пройти тест
                </button>
              </div>
            </div>
            <TestReview selectedVariant={props.selectedVariant}></TestReview>
          </div>
        </VariantContext.Provider>
      )}
      {isDelete === true && <h1>Тест Видалено</h1>}
    </div>
  );
};
export default SelectedVariant;
