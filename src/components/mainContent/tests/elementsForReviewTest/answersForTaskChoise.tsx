import { MathJax } from "better-react-mathjax";
import type { Answers } from "../../creatorVariant/types";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { app } from "../../../../firebaseConfig";
const Answers = (props: { answers: Answers; selectedVariant: string }) => {
  console.log(!!props.answers.values);
  props.answers.pictures &&
    console.log(`${props.selectedVariant}/${props.answers.pictures[0]}`);
  const mark = ["А", "Б", "В", "Г", "Д"];
  return (
    <div className="box_for_view_answers">
      {mark.map((item, index) => (
        <div key={index} className="view_answer p-2">
          <p className="m-0">{item})</p>{" "}
          <div>
            {props.answers.pictures && props.answers.pictures[index] && (
              <Picture
                url={`${props.selectedVariant}/${props.answers.pictures[index]}`}
                classForPicture="picture_for_view"
              ></Picture>
            )}
            {props.answers.values && props.answers.values[index] && (
              <MathJax>{props.answers.values[index]}</MathJax>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Answers;
//КОМПОНЕНТ ДЛЯ ВІДПОВІДЕЙ
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
