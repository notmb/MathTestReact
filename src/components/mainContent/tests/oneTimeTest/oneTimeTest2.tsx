import { useImmer } from "use-immer";
import { useEffect } from "react";
import { db } from "../../../../firebaseConfig";
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

import ContainerForMathTest from "../containerForMathTests";

type AnswerSingle = string;

type AnswerMulti = {
  [subTaskNumber: string]: string;
};

type UserAnswers = {
  [taskNumber: string]: AnswerSingle | AnswerMulti;
};

type TestLink = {
  studentId: string;
  nameStudent: string;
  typeTest: "main" | "retaking" | null;
  variantId: string;
  startedAt: Timestamp | null;
  durationSec: number;
  testLinkStatus: "notStarted" | "started" | "finished";
  testResult: string;
};

const OneTimeTest = (props: { selectedLink: string }) => {
  const [testLinkData, updateTestLinkData] = useImmer<TestLink | null>(null); //дані лінка

  // const [idStudentProfil, setIdStudentProfil] = useState<string>("noName");

  //ОТРИМУЄМО ДАНІ ЛІНКА
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink,
      );
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as TestLink;
          updateTestLinkData(data);
        } else {
          console.warn("Документ не знайдено");
        }
      } catch (error) {
        console.error("Помилка:", error);
      }
    };

    fetchData();
  }, []);
  //ОТРИМУЄМО ДАНІ ЛІНКА
  console.log(testLinkData);

  //END TEST
  //записуємо результати
  const endTest = async (
    userAnswers: UserAnswers,
    result: string,
    pointsForTasks: { [key: string]: number },
    variantId: string,
    variantSerialNumber: string,
    finishReason: "manual" | "timeOut",
  ) => {
    if (!testLinkData?.studentId) return; // 🔒 захист від undefined
    if (!props.selectedLink) return; // 🔒 захист від undefined

    const safe = async (title: string, fn: () => Promise<void>) => {
      try {
        await fn();
        console.log(title);
      } catch (error) {
        console.error(title, error);
      }
    };

    // TESTLINKS
    //допис кількох полів у TestLinks
    await safe("debug1: updated TestLinks", async () => {
      const updateDataLink = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink,
      );

      await updateDoc(updateDataLink, {
        used: true,
        testResult: result,
        finishedAt: serverTimestamp(),
        finishReason: finishReason,
      });
    });

    //допис кількох полів у TestLinks
    // TESTLINKS

    //MYSTUDENTS
    //короткий запис у MyStudents
    const property =
      testLinkData?.typeTest === "main"
        ? "testScores"
        : testLinkData?.typeTest === "retaking"
          ? "testScoresRetaking"
          : "testScoresUnknownType";
    console.log(property);

    await safe("debug2: saved short score in MyStudents", async () => {
      const resultsRefInUserProfil = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        testLinkData.studentId,
      );

      await updateDoc(resultsRefInUserProfil, {
        [`${property}.${variantSerialNumber}`]: result,
      });
    });
    //короткий запис у MyStudents

    //запис детальних результатів у MyStudents
    await safe("saved detailed results", async () => {
      const detailedResultsRefInUserProfil = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        testLinkData.studentId,
        "ResultsTest",
        variantId,
      );

      await setDoc(
        detailedResultsRefInUserProfil,
        { userAnswers, pointsForTasks, result },
        { merge: true },
      );
    });
    //запис детальних результатів у MyStudents
    //MYSTUDENTS

    //записуємо результати тесту

    console.log("Тест закінчено");
  };
  //END TEST

  return (
    <div>
      {testLinkData && testLinkData.testLinkStatus != "finished" && (
        <div>
          <ContainerForMathTest
            selectedVariant={testLinkData.variantId}
            startedAt={testLinkData.startedAt}
            endTest={endTest}
          ></ContainerForMathTest>
        </div>
      )}
      {testLinkData && testLinkData.testLinkStatus === "finished" && (
        <h1>Тест закінчено</h1>
      )}
      <h4> OneTimeTest</h4>
    </div>
  );
};
export default OneTimeTest;
