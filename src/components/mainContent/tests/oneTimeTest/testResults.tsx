import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import TestResultsReview from "./TestResultsReview";

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
  const [studentName, setStudentName] = useState<string | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const selectedLink = searchParams.get("link");

  useEffect(() => {
    const fetchUserAnswersData = async () => {
      if (!selectedLink) {
        setErrorMessage("Не вистачає параметрів для перегляду результатів.");
        setFetchStatus("error");
        return;
      }

      setFetchStatus("loading");
      setErrorMessage(null);

      try {
        const linkRef = doc(db, "Subjects", "Math", "TestLinks", selectedLink);
        const linkSnap = await getDoc(linkRef);

        if (!linkSnap.exists()) {
          setErrorMessage("Лінк не знайдено.");
          setFetchStatus("error");
          return;
        }

        const linkData = linkSnap.data();
        const currentStudentName = linkData.nameStudent;

        if (
          typeof currentStudentName !== "string" ||
          currentStudentName.trim() === ""
        ) {
          setErrorMessage("Не вдалося визначити учня для цього результату.");
          setFetchStatus("error");
          return;
        }

        setStudentName(currentStudentName);

        const resultRef = doc(
          db,
          "Subjects",
          "Math",
          "TestLinks",
          selectedLink,
          "testResults",
          currentStudentName,
        );

        const resultSnap = await getDoc(resultRef);

        if (!resultSnap.exists()) {
          setErrorMessage("Результати учня не знайдено.");
          setFetchStatus("error");
          return;
        }

        const userAnswersData = resultSnap.data();
        setUserAnswers(
          userAnswersData.userAnswers || userAnswersData.userAnswer || {},
        );
        setFetchStatus("success");
      } catch (error) {
        console.error("Помилка при отриманні результатів тесту:", error);
        setErrorMessage("Не вдалося завантажити результати тесту.");
        setFetchStatus("error");
      }
    };

    fetchUserAnswersData();
  }, [selectedLink]);

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
    <div className="test-results-page">
      <div className="test-results-page-header">
        <button className="test-results-back-btn" onClick={handleBack}>
          Назад
        </button>
      </div>

      <section className="test-results-page-summary">
        <h1 className="test-results-page-title">
          Результати учня{studentName ? `: ${studentName}` : ""}
        </h1>
      </section>

      {fetchStatus === "loading" && (
        <p className="test-results-page-state">Завантаження результатів...</p>
      )}

      {fetchStatus === "error" && errorMessage && (
        <p className="test-results-page-state test-results-page-state-error">
          {errorMessage}
        </p>
      )}

      {fetchStatus === "success" && (
        <section className="test-results-page-content">
          <TestResultsReview
            selectedVariant={props.selectedVariant}
            userAnswers={userAnswers}
            nameStudent={studentName ?? undefined}
          />
        </section>
      )}
    </div>
  );
};

export default TestResults;
