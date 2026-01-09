import TestReview from "./elementsForReviewTest/testReview";
import AddTask from "../creatorVariant/addTask";
import { useState } from "react";
import { useVariantContext } from "./variantContext";

import {
  doc,
  deleteDoc,
  addDoc,
  collection,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { WrapperForModalWindow } from "../reactTsUtils";

const SelectedVariant = (props: {
  selectedVariant: string;
  navigate: (path: string) => void;
}) => {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalForAddTaskOpen, setIsModalForAddTaskOpen] =
    useState<boolean>(false);
  const { dataVariant, tasks } = useVariantContext();

  const handlePassTheTest = (selectedVariant: string) => {
    props.navigate(
      `/MathTestReact/allTest/selectedVariant/${dataVariant.typeTest}/${selectedVariant}/test`
    );
  };

  const handleOneTimePassTheTest = (selectedVariant: string) => {
    props.navigate(
      `/MathTestReact/allTest/selectedVariant/${dataVariant.typeTest}/${selectedVariant}/one-time-links`
    );
  };

  const handleAddTask = () => {
    setIsModalForAddTaskOpen(true);
  };

  const handleDelete = async () => {
    await deleteDoc(
      doc(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        dataVariant.typeTest === "main" ? "Mix" : "Retaking",
        props.selectedVariant
      )
    );
    setIsModalOpen(false);
    setIsDelete(true);
  };

  const handleCopyToRetaking = async () => {
    try {
      const docRef = await addDoc(
        collection(db, "Subjects", "Math", "Algebra", "Topics", "Retaking"),
        {
          variantName: dataVariant.variantName,
          variantSerialNumber: dataVariant.variantSerialNumber,
          numberOfTask: dataVariant.numberOfTasks,
          typeTest: "retaking",
          createdAt: new Date(),
        }
      );
      const newId = docRef.id;

      const batch = writeBatch(db);
      const colRef = collection(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        "Retaking",
        newId,
        "tasks"
      );

      Object.entries(tasks).forEach(([key, item]) => {
        const docRef = doc(colRef, key);
        batch.set(docRef, item);
      });

      await batch.commit(); // ✅ обов’язково!
      console.log("✅ Tasks saved successfully!");
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  return (
    <div className="container_for_selected_test">
      {isDelete === false && (
        <div className="selected_test">
          <div className="buttons">
            <div className="left_side">
              <button
                className="custom_button"
                onClick={() => setIsModalOpen(true)}
              >
                Видалити
              </button>
              {isModalOpen && (
                <WrapperForModalWindow onClose={() => setIsModalOpen(false)}>
                  <div style={{ padding: "20px", textAlign: "center" }}>
                    <p className="text-xl">Ви дійсно хочете видалити тест?</p>
                    <div style={{ marginTop: "20px" }}>
                      <button
                        className="text-xl"
                        onClick={handleDelete}
                        style={{ marginRight: "10px" }}
                      >
                        Так
                      </button>
                      <button
                        className="text-xl"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Ні
                      </button>
                    </div>
                  </div>
                </WrapperForModalWindow>
              )}

              <button
                className="custom_button"
                onClick={() => handleOneTimePassTheTest(props.selectedVariant)}
              >
                Одноразові посилання
              </button>
              <button
                className="custom_button"
                onClick={() => handleCopyToRetaking()}
              >
                Скопіювати у Перездачу
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
          <button className="custom_button" onClick={() => handleAddTask()}>
            Додати завдання до тесту
          </button>

          {isModalForAddTaskOpen && (
            <WrapperForModalWindow
              onClose={() => setIsModalForAddTaskOpen(false)}
            >
              <AddTask
                selectedVariant={props.selectedVariant}
                onSuccess={() => setIsModalForAddTaskOpen(false)}
              ></AddTask>
              <button
                className="text-xl"
                onClick={() => {
                  setIsModalForAddTaskOpen(false);
                }}
                style={{ marginRight: "10px" }}
              >
                Так
              </button>
            </WrapperForModalWindow>
          )}
        </div>
      )}
      {isDelete === true && <h1>Тест Видалено</h1>}
    </div>
  );
};
export default SelectedVariant;
