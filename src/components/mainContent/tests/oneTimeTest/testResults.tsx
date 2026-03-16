import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import TestResultsReview from "./TestResultsReview";
import ResultCorrectionModal from "./resultCorrectionModal";

type UserAnswerValue = string | Record<string, string>;
type UserAnswersState = Record<string, UserAnswerValue>;
type FetchStatus = "loading" | "success" | "error";
type LinkType = "main" | "retaking" | null;

const TestResults = (props: {
  navigate?: (path: string) => void;
  selectedVariant: string;
}) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswersState>({});
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [teacherComment, setTeacherComment] = useState("");
  const [linkTypeTest, setLinkTypeTest] = useState<LinkType>(null);
  const [variantSerialNumber, setVariantSerialNumber] = useState<string | null>(
    null,
  );
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isSavingCorrection, setIsSavingCorrection] = useState(false);

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
        const currentStudentId = linkData.studentId;
        const currentFinalResult = linkData.testResult;
        const currentTeacherComment = linkData.teacherResultComment;
        const currentTypeTest = linkData.typeTest;
        const currentVariantSerialNumber = linkData.variantSerialNumber;

        if (
          typeof currentStudentName !== "string" ||
          currentStudentName.trim() === ""
        ) {
          setErrorMessage("Не вдалося визначити учня для цього результату.");
          setFetchStatus("error");
          return;
        }

        setStudentName(currentStudentName);
        setStudentId(
          typeof currentStudentId === "string" && currentStudentId.trim() !== ""
            ? currentStudentId
            : null,
        );
        setFinalResult(
          typeof currentFinalResult === "string" &&
            currentFinalResult.trim() !== ""
            ? currentFinalResult
            : null,
        );
        setTeacherComment(
          typeof currentTeacherComment === "string"
            ? currentTeacherComment
            : "",
        );
        setLinkTypeTest(
          currentTypeTest === "main" || currentTypeTest === "retaking"
            ? currentTypeTest
            : null,
        );
        setVariantSerialNumber(
          typeof currentVariantSerialNumber === "string" &&
            currentVariantSerialNumber.trim() !== ""
            ? currentVariantSerialNumber
            : null,
        );

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

  const handleSaveCorrection = async (payload: {
    nextResult: string;
    comment: string;
  }) => {
    if (!selectedLink) {
      return;
    }

    setIsSavingCorrection(true);

    try {
      const linkRef = doc(db, "Subjects", "Math", "TestLinks", selectedLink);
      await updateDoc(linkRef, {
        testResult: payload.nextResult,
        teacherResultComment: payload.comment,
        teacherResultUpdatedAt: serverTimestamp(),
      });

      if (studentId && variantSerialNumber) {
        const studentRef = doc(db, "Subjects", "Math", "MyStudents", studentId);

        if (linkTypeTest === "main") {
          await setDoc(
            studentRef,
            {
              testScores: {
                [variantSerialNumber]: payload.nextResult,
              },
            },
            { merge: true },
          );
        }

        if (linkTypeTest === "retaking") {
          await setDoc(
            studentRef,
            {
              testScoresRetaking: {
                [variantSerialNumber]: payload.nextResult,
              },
            },
            { merge: true },
          );
        }
      }

      if (studentId) {
        const studentResultRef = doc(
          db,
          "Subjects",
          "Math",
          "MyStudents",
          studentId,
          "ResultsTest",
          props.selectedVariant,
        );

        await setDoc(
          studentResultRef,
          {
            result: payload.nextResult,
            teacherResultComment: payload.comment,
            teacherResultUpdatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      }

      setFinalResult(payload.nextResult);
      setTeacherComment(payload.comment);
      setIsCorrectionModalOpen(false);
    } catch (error) {
      console.error("Помилка при коригуванні результату:", error);
      setErrorMessage("Не вдалося зберегти скоригований результат.");
    } finally {
      setIsSavingCorrection(false);
    }
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
        {finalResult && (
          <p className="test-results-page-result">
            <strong>Підсумковий результат:</strong> {finalResult}
          </p>
        )}
        <div className="test-results-page-summary-actions">
          <button
            type="button"
            className="test-results-summary-btn"
            onClick={() => setIsCorrectionModalOpen(true)}
          >
            Скоригувати результат
          </button>
        </div>
        {teacherComment && (
          <p className="test-results-page-meta">
            <strong>Коментар вчителя:</strong> {teacherComment}
          </p>
        )}
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

      {isCorrectionModalOpen && (
        <ResultCorrectionModal
          currentResult={finalResult}
          initialComment={teacherComment}
          isSaving={isSavingCorrection}
          onClose={() => setIsCorrectionModalOpen(false)}
          onSubmit={handleSaveCorrection}
        />
      )}
    </div>
  );
};

export default TestResults;
