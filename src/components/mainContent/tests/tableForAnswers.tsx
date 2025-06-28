import "../tests.css";
import { MathJax } from "better-react-mathjax";
import type { Answers } from "../creatorVariant/types";
import Picture from "./imageComponent";

const TableForAnswersToTaskChoice = (props: {
  answers: Answers;
  selectedVariant: string;
}) => {
  const mark = ["А", "Б", "В", "Г", "Д"];
  return (
    <div>
      <div className="answer_table1">
        {[0, 1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className={`columns_in_answers_table columns_in_answers_table_${index}`}
          >
            <div className="mark_in_answers_table font-bold text-xl">
              {mark[index]}
            </div>
            <div className="option_in_answers_table text-xl ">
              {props.answers.pictures && props.answers.pictures[index] && (
                <Picture
                  url={`${props.selectedVariant}/${props.answers.pictures[index]}`}
                  classForPicture="picture_for_answer"
                ></Picture>
              )}
              {props.answers.values && props.answers.values[index] && (
                <MathJax>{props.answers.values[index]}</MathJax>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TableForAnswersToTaskChoice;
