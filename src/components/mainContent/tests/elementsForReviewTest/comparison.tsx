import { MathJax } from "better-react-mathjax";
import { Comparison } from "../../types";

const ComparisonData = (props: {
  comparisonTable: Comparison;
  selectedVariant: string;
}) => {
  const marks = ["А", "Б", "В", "Г", "Д"];

  return (
    <div className="review-comparison">
      <div className="review-comparison-column">
        <ul className="review-comparison-list">
          {props.comparisonTable.list1.texts &&
            props.comparisonTable.list1.texts.map((item, index) => (
              <li key={index} className="review-comparison-item">
                <span className="review-comparison-item-mark">{index + 1})</span>
                <span className="review-comparison-item-value">
                  <MathJax dynamic>{item}</MathJax>
                </span>
              </li>
            ))}
        </ul>
      </div>
      <div className="review-comparison-column">
        <ul className="review-comparison-list">
          {props.comparisonTable.list2.texts &&
            props.comparisonTable.list2.texts.map((item, index) => (
              <li key={index} className="review-comparison-item">
                <span className="review-comparison-item-mark">{marks[index]})</span>
                <span className="review-comparison-item-value">
                  <MathJax dynamic>{item}</MathJax>
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ComparisonData;
