import { MathJax } from "better-react-mathjax";
import { app } from "../../../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

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
        <Picture
          url={`${props.selectedVariant}/${props.picture}`}
          classForPicture="review-task-picture"
        ></Picture>
      )}
    </div>
  );
};

export default Task;

const fetchImage = async (url: string) => {
  const storage = getStorage(app);
  const storageRef = ref(storage, url);

  return getDownloadURL(storageRef);
};

const Picture = (props: { url: string; classForPicture: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImage(props.url).then((newUrl) => setImageUrl(newUrl));
  }, [props.url]);

  return (
    <div className="review-task-picture-wrap">
      {imageUrl ? (
        <img
          className={props.classForPicture}
          src={imageUrl}
          alt="Loaded from Firebase"
        />
      ) : (
        <p className="review-task-picture-loading">Завантаження зображення...</p>
      )}
    </div>
  );
};

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
