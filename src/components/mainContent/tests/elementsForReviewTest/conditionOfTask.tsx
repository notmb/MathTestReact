import { MathJax } from "better-react-mathjax";
import { app } from "../../../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
//КОМПОНЕНТ ЗАВДАННЯ
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
    <div className="task_box">
      <div>
        <MathJax dynamic>{props.text}</MathJax>
      </div>
      {props.list && <ListToQestion list={props.list}></ListToQestion>}
      {props.table && (
        <TableToQestion
          list1={props.table.value1}
          list2={props.table.value2}
        ></TableToQestion>
      )}
      {props.picture && (
        <Picture
          url={`${props.selectedVariant}/${props.picture}`}
          classForPicture="h-[100px]"
        ></Picture>
      )}
    </div>
  );
};
//КОМПОНЕНТ ЗАВДАННЯ
export default Task;

const fetchImage = async (url: string) => {
  const storage = getStorage(app); // Отримуємо екземпляр Storage
  const storageRef = ref(storage, url); // Шлях до файлу в Storage

  return getDownloadURL(storageRef);
};

//КОМПОНЕНТ ЗОБРАЖЕННЯ
const Picture = (props: { url: string; classForPicture: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImage(props.url).then((newUrl) => setImageUrl(newUrl)); // Викликаємо завантаження зображення при завантаженні компонента
  }, [props.url]);
  return (
    <div className="container_for_picture">
      {imageUrl ? (
        <img
          className={props.classForPicture}
          src={imageUrl}
          alt="Loaded from Firebase"
        />
      ) : (
        <p>Завантаження зображення...</p>
      )}
    </div>
  );
};
//КОМПОНЕНТ ЗОБРАЖЕННЯ
//КОМПОНЕНТ СПИСКУ ДО ЗАПИТАННЯ
const ListToQestion = (props: { list: string[] }) => {
  return (
    <div className="box_for_list_in_task">
      {props.list.map((item, index) => (
        <span key={index} className="list_in_task">
          {index + 1}. <MathJax dynamic>{item}</MathJax>
        </span>
      ))}
    </div>
  );
};
//КОМПОНЕНТ СПИСКУ ДО ЗАПИТАННЯ

//КОМПОНЕНТ ТАБЛИЦІ ДО ЗАПИТАННЯ
const TableToQestion = (props: { list1: string[]; list2: string[] }) => {
  return (
    <div className="box_for_table_in_task">
      <table className="table_to_qestion">
        <tbody>
          <tr>
            {props.list1.map((item, index) => (
              <td key={index} className="table_to_qestion_list1">
                <MathJax dynamic>{item}</MathJax>
              </td>
            ))}
          </tr>
          <tr>
            {props.list2.map((item, index) => (
              <td key={index} className="table_to_qestion_list2">
                <MathJax dynamic>{item}</MathJax>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
//КОМПОНЕНТ ТАБЛИЦІ ДО ЗАПИТАННЯ
