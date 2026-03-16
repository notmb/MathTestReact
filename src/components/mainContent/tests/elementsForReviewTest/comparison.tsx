import { MathJax } from "better-react-mathjax";
import type { ComparisonTable } from "../../types";
import FirebaseImage from "./firebaseImage";

const marks = ["А", "Б", "В", "Г", "Д"];

const ComparisonData = (props: {
  comparisonTable: ComparisonTable;
  selectedVariant: string;
}) => {
  return (
    <div className="review-comparison">
      <ComparisonColumn
        items={props.comparisonTable.list1.texts}
        pictures={props.comparisonTable.list1.pictures}
        selectedVariant={props.selectedVariant}
        getMark={(index) => `${index + 1})`}
      />
      <ComparisonColumn
        items={props.comparisonTable.list2.texts}
        pictures={props.comparisonTable.list2.pictures}
        selectedVariant={props.selectedVariant}
        getMark={(index) => `${marks[index] ?? ""})`}
      />
    </div>
  );
};

const ComparisonColumn = (props: {
  items?: string[];
  pictures?: string[];
  selectedVariant: string;
  getMark: (index: number) => string;
}) => {
  const rowCount = Math.max(
    props.items?.length ?? 0,
    props.pictures?.length ?? 0,
  );

  if (rowCount === 0) {
    return <div className="review-comparison-column"></div>;
  }

  return (
    <div className="review-comparison-column">
      <ul className="review-comparison-list">
        {Array.from({ length: rowCount }, (_, index) => {
          const text = props.items?.[index];
          const picture = props.pictures?.[index];

          return (
            <li key={index} className="review-comparison-item">
              <span className="review-comparison-item-mark">
                {props.getMark(index)}
              </span>
              <div className="review-comparison-item-value">
                {text && <MathJax dynamic>{text}</MathJax>}
                {picture && (
                  <FirebaseImage
                    url={`${props.selectedVariant}/${picture}`}
                    className="review-answer-picture"
                    wrapperClassName="review-answer-picture-wrap"
                    loadingClassName="review-answer-picture-loading"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ComparisonData;
