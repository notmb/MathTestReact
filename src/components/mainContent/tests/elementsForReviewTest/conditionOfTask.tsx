import { MathJax } from "better-react-mathjax";
import FirebaseImage from "./firebaseImage";

const Task = (props: {
  selectedVariant: string;
  text: string;
  table?: {
    value1: string[];
    value2: string[];
  };
  picture?: string;
  list?: string[];
}) => {
  return (
    <div className="review-task">
      <div className="review-task-text">
        <MathJax dynamic>{props.text}</MathJax>
      </div>
      {props.list && <ListToQuestion list={props.list}></ListToQuestion>}
      {props.table && (
        <TableToQuestion
          list1={props.table.value1}
          list2={props.table.value2}
        ></TableToQuestion>
      )}
      {props.picture && (
        <FirebaseImage
          url={`${props.selectedVariant}/${props.picture}`}
          className="review-task-picture"
          wrapperClassName="review-task-picture-wrap"
          loadingClassName="review-task-picture-loading"
        />
      )}
    </div>
  );
};

export default Task;

const ListToQuestion = (props: { list: string[] }) => {
  return (
    <div className="review-task-list-wrap">
      {props.list.map((item, index) => (
        <span key={index} className="review-task-list-item">
          {index + 1}. <MathJax dynamic>{item}</MathJax>
        </span>
      ))}
    </div>
  );
};

const TableToQuestion = (props: { list1: string[]; list2: string[] }) => {
  return (
    <div className="review-task-table-wrap">
      <table className="review-task-table">
        <tbody>
          <tr>
            {props.list1.map((item, index) => (
              <td
                key={index}
                className="review-task-table-cell review-task-table-cell-primary"
              >
                <MathJax dynamic>{item}</MathJax>
              </td>
            ))}
          </tr>
          <tr>
            {props.list2.map((item, index) => (
              <td
                key={index}
                className="review-task-table-cell review-task-table-cell-secondary"
              >
                <MathJax dynamic>{item}</MathJax>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
