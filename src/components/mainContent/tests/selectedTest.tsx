import TestReview from "./elementsForReviewTest/testReview";
import { useState } from "react";

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const SelectedVariant = (props: {
  selectedVariant: string;
  navigate: (path: string) => void;
}) => {
  const [isDelete, setIsDelete] = useState<boolean>(false);

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
                onClick={() => handleOneTimePassTheTest(props.selectedVariant)}
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
      )}
      {isDelete === true && <h1>Тест Видалено</h1>}
    </div>
  );
};
export default SelectedVariant;
