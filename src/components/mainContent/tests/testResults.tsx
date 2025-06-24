import { Task1, Task2, Task3 } from "../creatorVariant/types";
import { useImmer } from "use-immer";
import { db } from "../../../firebaseConfig";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import TestReview from "./elementsForReviewTest/testReview";

const TestResults = (props: {
  onClose: () => void;
  selectedLink: string;
  nameStudent: string;
  variantId: string;
}) => {
  const [userAnswers, updateUserAnswers] = useImmer<{ [key: string]: any }>({});

  const fetchUserAnswersData = async () => {
    const docRef = doc(
      db,
      "Subjects",
      "Math",
      props.selectedLink,
      "testResults",
      props.nameStudent
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userAnswersData = docSnap.data();
      updateUserAnswers(() => userAnswersData.userAnswer);
    } else {
      console.warn("Документ не знайдено");
    }
  };

  return (
    <div className="containerForChekResults">
      <div className="user_answer">
        {Object.entries(userAnswers).map(([questionKey, answer], index) => (
          <div key={index} className="answer-block">
            <strong>{questionKey}:</strong>{" "}
            {typeof answer === "string" ? (
              <span>{answer}</span>
            ) : (
              <div className="nested-answers">
                {Object.entries(answer).map(([subKey, subValue], subIndex) => (
                  <div key={subIndex}>
                    <em>{subKey}:</em> {String(subValue)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <TestReview selectedVariant={props.variantId}></TestReview>
    </div>
  );
};

export default TestResults;
