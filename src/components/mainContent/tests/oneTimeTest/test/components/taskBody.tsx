import { MathJax } from "better-react-mathjax";
import type { Question } from "../oneTimeTest.types";
import FirebasePicture from "./FirebasePicture";

const ListToQestion = (props: { list: string[] }) => {
  return (
    <div className="box-for-list-in-task">
      {props.list.map((item, index) => (
        <span key={index} className="list-in-task">
          {index + 1}. <MathJax>{item}</MathJax>
        </span>
      ))}
    </div>
  );
};

const TableToQestion = (props: { list1: string[]; list2: string[] }) => {
  return (
    <div className="box-for-table-in-task">
      <table className="table-to-question">
        <tbody>
          <tr>
            {props.list1.map((item, index) => (
              <td key={index} className="table-to-question-list1">
                <MathJax>{item}</MathJax>
              </td>
            ))}
          </tr>
          <tr>
            {props.list2.map((item, index) => (
              <td key={index} className="table-to-question-list2">
                <MathJax>{item}</MathJax>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const TaskBody = (props: { selectedVariant: string; task: Question }) => {
  return (
    <div className="task-box">
      <div className="text-2xl text-for-task">
        <MathJax>{props.task.text}</MathJax>
      </div>
      {props.task.list && (
        <ListToQestion list={props.task.list}></ListToQestion>
      )}
      {props.task.table && (
        <TableToQestion
          list1={props.task.table.value1}
          list2={props.task.table.value2}
        ></TableToQestion>
      )}
      {props.task.picture && (
        <FirebasePicture
          url={`${props.selectedVariant}/${props.task.picture}`}
          className="picture-for-question"
        ></FirebasePicture>
      )}
    </div>
  );
};

export default TaskBody;

