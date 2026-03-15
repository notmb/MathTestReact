import { MathJax } from "better-react-mathjax";
import type { Answers } from "../../types";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { app } from "../../../../firebaseConfig";

const Answers = (props: { answers: Answers; selectedVariant: string }) => {
  const marks = ["А", "Б", "В", "Г", "Д"];

  return (
    <div className="review-answers">
      {marks.map((mark, index) => (
        <div key={index} className="review-answer-option">
          <p className="review-answer-mark">{mark})</p>
          <div className="review-answer-content">
            {props.answers.pictures && props.answers.pictures[index] && (
              <Picture
                url={`${props.selectedVariant}/${props.answers.pictures[index]}`}
                classForPicture="review-answer-picture"
              ></Picture>
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
    <div className="review-answer-picture-wrap">
      {imageUrl ? (
        <img
          className={props.classForPicture}
          src={imageUrl}
          alt="Loaded from Firebase"
        />
      ) : (
        <p className="review-answer-picture-loading">Завантаження зображення...</p>
      )}
    </div>
  );
};
