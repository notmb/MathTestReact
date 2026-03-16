import { useState } from "react";
import "./selectedTest.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import AddTask from "../creatorVariant/addTask";
import { WrapperForModalWindow } from "../reactTsUtils";
import { db } from "../../../firebaseConfig";
import TestReview from "./elementsForReviewTest/testReview";
import { useVariantContext } from "./variantContext";

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
      `/MathTestReact/allTest/selectedVariant/${dataVariant.typeTest}/${selectedVariant}/localtest`,
    );
  };

  const handleOneTimePassTheTest = (selectedVariant: string) => {
    props.navigate(
      `/MathTestReact/allTest/selectedVariant/${dataVariant.typeTest}/${selectedVariant}/one-time-links`,
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
        props.selectedVariant,
      ),
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
        },
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
        "tasks",
      );

      Object.entries(tasks).forEach(([key, item]) => {
        const taskRef = doc(colRef, key);
        batch.set(taskRef, item);
      });

      await batch.commit();
      console.log("Tasks saved successfully.");
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  return (
    <div className="container_for_selected_test">
      {!isDelete && (
        <div className="selected-test-page">
          <section className="selected-test-header">
            <div className="selected-test-header-meta">
              <h1 className="selected-test-title">
                {dataVariant.variantName || `Тест ${props.selectedVariant}`}
              </h1>
              <p className="selected-test-subtitle">
                Варіант: {dataVariant.variantSerialNumber || props.selectedVariant}
              </p>
              <button
                className="selected-test-delete-link"
                onClick={() => setIsModalOpen(true)}
              >
                Видалити тест
              </button>
            </div>

            <div className="selected-test-header-actions">
              <button
                className="selected-test-btn selected-test-btn-secondary"
                onClick={() => handleOneTimePassTheTest(props.selectedVariant)}
              >
                Одноразові посилання
              </button>
              <button
                className="selected-test-btn selected-test-btn-secondary"
                onClick={() => handleCopyToRetaking()}
              >
                Скопіювати у перездачу
              </button>
              <button
                className="selected-test-btn selected-test-btn-primary"
                onClick={() => handlePassTheTest(props.selectedVariant)}
              >
                Пройти тест
              </button>
            </div>
          </section>

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

          <section className="selected-test-content">
            <TestReview selectedVariant={props.selectedVariant}></TestReview>
          </section>

          <section className="selected-test-footer-actions">
            <button
              className="selected-test-btn selected-test-btn-primary"
              onClick={() => handleAddTask()}
            >
              Додати завдання
            </button>
          </section>

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

      {isDelete && <h1>Тест видалено</h1>}
    </div>
  );
};

export default SelectedVariant;
