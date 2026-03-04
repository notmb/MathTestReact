import "../../../style.css";
import { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";
import { app } from "../../../../../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import type { Question } from "../oneTimeTest.types";

const TaskOpenAnswer = (props: {
  selectedVariant: string;
  task: Question;
  number: string;
  currentAnswer?: string;
  updateUserAnswer: (idTask: string, userAnswer: string) => void;
}) => {
  return (
    <div className="tests_item">
      <p className="container_serial_num_task">
        Р—Р°РІРґР°РЅРЅСЏ {props.number}
      </p>
      <Task
        selectedVariant={props.selectedVariant}
        text={props.task.text}
        picture={props.task.picture}
      ></Task>
      <OpenAnswer
        number={props.number}
        currentAnswer={props.currentAnswer}
        updateUserAnswer={props.updateUserAnswer}
      ></OpenAnswer>
    </div>
  );
};

export default TaskOpenAnswer;

//РљРћРњРџРћРќР•РќРў Р—РђР’Р”РђРќРќРЇ
const Task = (props: {
  selectedVariant: string;
  text: string;
  table?: {
    value1: string[];
    velue2: string[];
  };
  picture?: string;
  list?: string[];
}) => {
  return (
    <div className="task_box">
      <div className="text-2xl">
        <MathJax>{props.text}</MathJax>
      </div>
      {props.picture && (
        <Picture
          url={`${props.selectedVariant}/${props.picture}`}
          classForPicture="picture_for_question"
        ></Picture>
      )}
    </div>
  );
};
//РљРћРњРџРћРќР•РќРў Р—РђР’Р”РђРќРќРЇ

//РљРћРњРџРћРќР•РќРў Р’Р†Р”РџРћР’Р†Р”Р† Р”Рћ Р—РђР’Р”РђРќРќРЇ Р— Р’Р†Р”РљР РРўРћР® Р’Р†Р”РџРћР’Р†Р”Р”Р®
const OpenAnswer = (props: {
  number: string;
  currentAnswer?: string;
  updateUserAnswer: (idTask: string, userAnswer: string) => void;
}) => {
  const handleChoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = event.target.value;
    props.updateUserAnswer(props.number, userAnswer);
  };

  return (
    <div className="box_for_user_answer">
      <input
        className="user_answer_open"
        id={props.number}
        type="number"
        placeholder="РІС–РґРїРѕРІС–РґСЊ.."
        value={props.currentAnswer ?? ""}
        onChange={handleChoiceChange}
      />
    </div>
  );
};
//РљРћРњРџРћРќР•РќРў Р’Р†Р”РџРћР’Р†Р”Р† Р”Рћ Р—РђР’Р”РђРќРќРЇ Р— Р’Р†Р”РљР РРўРћР® Р’Р†Р”РџРћР’Р†Р”Р”Р®

const fetchImage = async (url: string) => {
  console.log(url);
  const storage = getStorage(app);
  const storageRef = ref(storage, url);
  return getDownloadURL(storageRef);
};

//РљРћРњРџРћРќР•РќРў Р—РћР‘Р РђР–Р•РќРќРЇ
const Picture = (props: { url: string; classForPicture: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImage(props.url).then((newUrl) => setImageUrl(newUrl));
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
        <p>Р—Р°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ Р·РѕР±СЂР°Р¶РµРЅРЅСЏ...</p>
      )}
    </div>
  );
};
//РљРћРњРџРћРќР•РќРў Р—РћР‘Р РђР–Р•РќРќРЇ
