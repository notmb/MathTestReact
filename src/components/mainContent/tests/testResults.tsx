import { useImmer } from "use-immer";
import { db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
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
      "TestLinks",
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
  useEffect(() => {
    fetchUserAnswersData();
  }, []);

  console.log(userAnswers);
  return (
    <div className="container_for_chekResults">
      <div className="container_for_close_button">
        <div className="close_button" onClick={props.onClose}></div>
      </div>
      <div className="user_answer">
        <h2>Відповіді учня:</h2>
        <div className="inline_answers">
          {Object.entries(userAnswers).map(([questionKey, answer], index) => (
            <div key={index} className="answer_block">
              <strong>{questionKey})</strong> &nbsp;
              {typeof answer === "string" ? (
                <span>{answer}</span>
              ) : (
                <div className="box_nested_answers">
                  {Object.entries(answer).map(
                    ([subKey, subValue], subIndex) => (
                      <div key={subIndex} className="nested_answers">
                        <em>{subKey}:</em> {String(subValue)}{" "}
                        <p className="m-0">; </p>&nbsp;
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* <div className="box_for_test_review"> */}
      <TestReview selectedVariant={props.variantId}></TestReview>
      {/* </div> */}
    </div>
  );
};

export default TestResults;
