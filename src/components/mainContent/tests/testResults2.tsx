import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import TestResultsReview from "./oneTimeTest/TestResultsReview";

type UserAnswerValue = string | Record<string, string>;
type UserAnswersState = Record<string, UserAnswerValue>;
type FetchStatus = "loading" | "success" | "error";

const TestResults = (props: {
  navigate?: (path: string) => void;
  selectedVariant: string;
}) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswersState>({});
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const selectedLink = searchParams.get("link");
  const nameStudent = searchParams.get("student");

  useEffect(() => {
    const fetchUserAnswersData = async () => {
      if (!selectedLink || !nameStudent) {
        setErrorMessage("Не вистачає параметрів для перегляду результатів.");
        setFetchStatus("error");
        return;
      }

      setFetchStatus("loading");
      setErrorMessage(null);

      try {
        const docRef = doc(
          db,
          "Subjects",
          "Math",
          "TestLinks",
          selectedLink,
          "testResults",
          nameStudent,
        );

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setErrorMessage("Результати учня не знайдено.");
          setFetchStatus("error");
          return;
        }

        const userAnswersData = docSnap.data();
        setUserAnswers(userAnswersData.userAnswers || userAnswersData.userAnswer || {});
        setFetchStatus("success");
      } catch (error) {
        console.error("Помилка при отриманні результатів тесту:", error);
        setErrorMessage("Не вдалося завантажити результати тесту.");
        setFetchStatus("error");
      }
    };

    fetchUserAnswersData();
  }, [nameStudent, selectedLink]);

  const handleBack = () => {
    if (props.navigate) {
      const pathParts = window.location.pathname.split("/");
      pathParts.pop();
      props.navigate(pathParts.join("/"));
      return;
    }

    window.history.back();
  };

  return (
    <div className="container_for_chekResults">
      <div className="container_for_close_button">
        <button className="close_button" onClick={handleBack}></button>
      </div>

      <div className="user_answer">
        <h2>Результати учня{ nameStudent ? `: ${nameStudent}` : "" }</h2>
        {selectedLink && (
          <p>
            <strong>Link ID:</strong> {selectedLink}
          </p>
        )}
      </div>

      {fetchStatus === "loading" && <p>Завантаження результатів...</p>}

      {fetchStatus === "error" && errorMessage && <p>{errorMessage}</p>}

      {fetchStatus === "success" && (
        <TestResultsReview
          selectedVariant={props.selectedVariant}
          userAnswers={userAnswers}
          nameStudent={nameStudent ?? undefined}
        />
      )}
    </div>
  );
};

export default TestResults;
