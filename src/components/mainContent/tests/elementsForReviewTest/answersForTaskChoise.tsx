import { MathJax } from "better-react-mathjax";
import type { Answers } from "../../types";
import FirebaseImage from "./firebaseImage";

const Answers = (props: { answers: Answers; selectedVariant: string }) => {
  const marks = ["А", "Б", "В", "Г", "Д"];

  return (
    <div className="review-answers">
      {marks.map((mark, index) => (
        <div key={index} className="review-answer-option">
          <p className="review-answer-mark">{mark})</p>
          <div className="review-answer-content">
            {props.answers.pictures && props.answers.pictures[index] && (
              <FirebaseImage
                url={`${props.selectedVariant}/${props.answers.pictures[index]}`}
                className="review-answer-picture"
                wrapperClassName="review-answer-picture-wrap"
                loadingClassName="review-answer-picture-loading"
              />
            )}
            {props.answers.values && props.answers.values[index] && (
              <MathJax dynamic>{props.answers.values[index]}</MathJax>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Answers;
