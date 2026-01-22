import { useImmer } from "use-immer";
import { useState, useEffect } from "react";
import { db } from "../../../../firebaseConfig";
import {
  getDoc,
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import ContainerForMathTest from "../containerForMathTests";

type TestLink = {
  variantId: string;
  typeTest: string;
  used: boolean;
  nameStudent: string;
  testResult: string;
  // testLinkStatus?: "notStarted" | "started" | "finished";
};

const OneTimeTest = (props: { selectedLink: string }) => {
  const [testLinkData, updateTestLinkData] = useImmer<TestLink | null>(null); //дані лінка

  const [status, setStatus] = useState<"started" | "end" | null>(null);

  const [idStudentProfil, setIdStudentProfil] = useState<string>("noName");

  //отримуємо дані лінку
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink
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
        console.error("Помилка створення:", error);
      }
    };

    fetchData();
  }, []);
  //отримуємо дані лінку

  //дістаємось до профілю учня
  useEffect(() => {
    const fetchStudentProfil = async () => {
      if (!testLinkData?.nameStudent) return; // 🔒 захист від undefined
      const testResultsRef = collection(db, "Subjects", "Math", "MyStudents");
      const q = query(
        testResultsRef,
        where("name", "==", testLinkData?.nameStudent)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setIdStudentProfil(doc.id);
      } else {
        console.log("Документ з name='Olha' не знайдено");
      }
    };

    fetchStudentProfil();
  }, [testLinkData?.nameStudent]);
  //дістаємось до профілю учня

  //записуємо результати тесту
  const endTest = async (
    userAnswers: { [key: string]: any },
    result: string,
    pointsForTasks: { [key: string]: any },
    variantId: string,
    variantName: string,
    variantSerialNumber: string
  ) => {
    try {
      //запис у TestLiks/TestResults
      const resultsRef = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink,
        "testResults",
        testLinkData?.nameStudent || "noName"
      );
      await setDoc(resultsRef, {
        userAnswers: userAnswers,
        pointsForTasks: pointsForTasks,
        result: result,
        variantId: variantId,
        variantName: variantName,
      });
      console.log("debug");
    } catch (error) {
      console.error("Помилка:", error);
    }
    //заптис у TestLiks/TestResults

    //допис кількох полів у TestLinks
    try {
      const updateDataLink = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink
      );
      await updateDoc(updateDataLink, {
        used: true,
        testResult: result,
      });
      console.log("debug");
    } catch (error) {
      console.error("Помилка:", error);
    }
    //допис кількох полів у TestLinks

    //запис у MyStudents

    const property =
      testLinkData?.typeTest === "main" ? "testScores" : "testScoresRetaking";
    console.log(property);
    try {
      const resultsRefInUserProfil = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        idStudentProfil
      );
      await updateDoc(resultsRefInUserProfil, {
        [`${property}.${variantSerialNumber}`]: result,
      });
      console.log("debug");
    } catch (error) {
      console.error("Помилка:", error);
    }
    //запис у MyStudents

    //запис детальних результатів у MyStudents
    try {
      const detailedResultsRefInUserProfil = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        idStudentProfil,
        "ResultsTest",
        variantId
      );
      await updateDoc(detailedResultsRefInUserProfil, {
        userAnswers: userAnswers,
      });
      console.log("debug");
    } catch (error) {
      console.error("Помилка:", error);
    }

    try {
      const detailedResultsRefInUserProfil = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        idStudentProfil,
        "ResultsTest",
        variantId
      );

      await updateDoc(detailedResultsRefInUserProfil, {
        pointsForTasks: pointsForTasks,
      });
      console.log("debug");
    } catch (error) {
      console.error("Помилка:", error);
    }
    try {
      const detailedResultsRefInUserProfil = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        idStudentProfil,
        "ResultsTest",
        variantId
      );

      await updateDoc(detailedResultsRefInUserProfil, {
        result: result,
      });
      console.log("debug");
    } catch (error) {
      console.error("Помилка:", error);
    }
    //запис детальних результатів у MyStudents
    setStatus("end");
    console.log("Тест закінчено");
  };
  //записуємо результати тесту

  return (
    <div>
      {status === null && (
        <div className="conteiner_for_button_start_test">
          <button
            type="button"
            className="custom_button"
            onClick={() => setStatus("started")}
          >
            Почати тест
          </button>
        </div>
      )}
      {status === "started" && testLinkData && !testLinkData.used && (
        <div>
          <ContainerForMathTest
            selectedVariant={testLinkData.variantId}
            endTest={endTest}
          ></ContainerForMathTest>
        </div>
      )}
      {status === "end" && <h1>Тест закінчено</h1>}
    </div>
  );
};
export default OneTimeTest;
