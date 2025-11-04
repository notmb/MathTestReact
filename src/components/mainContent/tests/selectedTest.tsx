import TestReview from "./elementsForReviewTest/testReview";
import { useState } from "react";
import { useVariantContext } from "../../../context/variantContext";
import VariantContextWrapper from "../../../context/variantContextWrapper";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  doc,
  deleteDoc,
  addDoc,
  collection,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { WrapperForModalWindow } from "../reactTsUtils";

const SelectedVariant = () => {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dataVariant, tasks } = useVariantContext();
  const navigate = useNavigate();

  const { type, variant: variantId } = useParams<{
    type: string;
    variant: string;
  }>();
  console.log(type, variantId);

  if (!type || !variantId) {
    return <p>Некоректне посилання або відсутні параметри.</p>;
  }

  const handlePassTheTest = (selectedVariant: string) => {
    navigate(
      `/MathTestReact/allTest/selectedVariant/${dataVariant.typeTest}/${selectedVariant}/test`
    );
  };

  const handleOneTimePassTheTest = (selectedVariant: string) => {
    navigate(
      `/MathTestReact/allTest/selectedVariant/${dataVariant.typeTest}/${selectedVariant}/one-time-links`
    );
  };

  const handleDelete = async () => {
    if (!variantId) {
      console.error("variant не визначено");
      return;
    }
    await deleteDoc(
      doc(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        dataVariant.typeTest === "main" ? "Mix" : "Retaking",
        variantId
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
    <VariantContextWrapper variant={variantId} typeTest={type}>
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
                  onClick={() => {
                    if (!variantId) {
                      console.error("variant is undefined");
                      return;
                    }
                    handleOneTimePassTheTest(variantId);
                  }}
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
                  onClick={() => {
                    if (!variantId) {
                      console.error("variant is undefined");
                      return;
                    }
                    handlePassTheTest(variantId);
                  }}
                >
                  Пройти тест
                </button>
              </div>
            </div>
            {variantId ? (
              <TestReview selectedVariant={variantId} />
            ) : (
              <p>Варіант тесту не знайдено 😔</p>
            )}
          </div>
        )}
        {isDelete === true && <h1>Тест Видалено</h1>}
      </div>
    </VariantContextWrapper>
  );
};
export default SelectedVariant;
