import TestReview from "./elementsForReviewTest/testReview";
import { useState } from "react";
import MathTest from "./mathTests";
const SelectedVariant = (props: {
  selectedVariant: string;
  navigate: (path: string) => void;
}) => {
  const [passTheTest, setPassTheTest] = useState<boolean>(false);
  const handlePassTheTest = (nameTest: string) => {
    props.navigate(`/MathTestReact/allTest/${nameTest}/test`);
    setPassTheTest(true);
  };

  const handleOneTimePassTheTest = (nameTest: string) => {
    props.navigate(`/MathTestReact/allTest/${nameTest}/one-time-links`);
    setPassTheTest(true);
  };

  return (
    <div className="selected_test">
      <div className="buttons">
        <div className="left_side">
          <button className="custom_button">Редагувати</button>
          <button className="custom_button">Переіменувати</button>
          <button className="custom_button">Видалити</button>
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
      {!passTheTest && (
        <TestReview selectedVariant={props.selectedVariant}></TestReview>
      )}

      {passTheTest && (
        <MathTest selectedVariant={props.selectedVariant}></MathTest>
      )}
    </div>
  );
};
export default SelectedVariant;
