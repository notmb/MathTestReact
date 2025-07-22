import { useImmer } from "use-immer";
import { useState, useEffect } from "react";
import { db } from "../../../../firebaseConfig";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import ContainerForMathTest from "../containerForMathTests";

type TestLink = {
  variantId: string;
  used: boolean;
  nameStudent: string;
  testResult: string;
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
          console.log(testLinkData?.nameStudent);
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
        console.log("Знайдено документ:", doc.id, doc.data());
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
    variantName: string
  ) => {
    try {
      const resultsRef = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink,
        "testResults",
        testLinkData?.nameStudent || "noName"
      );
      const resultsRefInUserProfil = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        idStudentProfil
      );
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
      await setDoc(resultsRef, {
        userAnswer: userAnswers,
        pointsForTasks: pointsForTasks,
        result: result,
        variantId: variantId,
        variantName: variantName,
      });
      await updateDoc(resultsRefInUserProfil, {
        result: result,
        "testScores.topic3": result,
      });
      setStatus("end");
      console.log("Тест закінчено");
    } catch (error) {
      console.error("Помилка:", error);
    }
  };
  //записуємо результати тесту

  return (
    <div>
      {status === null && (
        <button
          type="button"
          className="custom_button"
          onClick={() => setStatus("started")}
        >
          Почати тест
        </button>
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
