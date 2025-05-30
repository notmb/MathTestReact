import { useState, useEffect } from "react";
import { db } from "../../../../firebaseConfig";
import {
  getDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import ContainerForMathTest from "../containerForMathTests";
import { useImmer } from "use-immer";
type TestLink = {
  variantId: string;
  used: boolean;
  nameStudent: string;
  testResult: string;
};
const OneTimeTest = (props: { selectedLink: string }) => {
  const [testLink, updateTestLink] = useImmer<TestLink | null>(null);
  const [start, setStart] = useState<boolean>(false);

  const [userId, setUserId] = useState<string>("");

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as TestLink;
        updateTestLink(data);
      } else {
        console.warn("Документ не знайдено");
      }
    };

    fetchData();
  }, []);

  testLink && console.log(testLink.variantId);

  const newUser = async (nameUser: string) => {
    const newUser = collection(db, "Subjects", "Math", "ResultsTest");
    try {
      const docRef = await addDoc(newUser, {
        name: nameUser,
        createdAt: new Date(),
      });
      setUserId(docRef.id);
      console.log("Користувача додано");
    } catch (error) {
      console.error("Помилка створення:", error);
    }
    setStart(true);
  };

  const endTest = async (
    userAnswers: { [key: string]: any },
    result: string,
    pointsForTasks: { [key: string]: any },
    variantId: string,
    variantName: string
  ) => {
    try {
      const resultsRef = doc(db, "Subjects", "Math", "ResultsTest", userId);
      const resultsRef2 = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink,
        "testResults",
        testLink?.nameStudent || "noName"
      );
      const updateDataLink = doc(
        db,
        "Subjects",
        "Math",
        "TestLinks",
        props.selectedLink
      );

      await updateDoc(resultsRef, {
        userAnswer: userAnswers, // додається нове поле
        pointsForTasks: pointsForTasks,
        result: result,
        variantId: variantId,
        variantName: variantName,
      });
      await updateDoc(updateDataLink, {
        used: true,
        testResult: result,
      });
      await setDoc(resultsRef2, {
        userAnswer: userAnswers, // додається нове поле
        pointsForTasks: pointsForTasks,
        result: result,
        variantId: variantId,
        variantName: variantName,
      });

      console.log("Користувача додано");
    } catch (error) {
      console.error("Помилка створення:", error);
    }
  };
  // const endTest ()

  return (
    <div>
      {!start && (
        <form id="form_for_user_name" className="form_for_user_name">
          <label htmlFor="user_name">Введіть своє ім'я</label>
          <input
            type="text"
            id="user_name"
            placeholder="Ім'я"
            name="variantName"
            onChange={(e) => setInputValue(e.target.value)}
          ></input>
          <button
            type="button"
            form="form_for_user_name"
            className="custom_button"
            onClick={() => newUser(inputValue)}
          >
            Почати тест
          </button>
        </form>
      )}

      {testLink && !testLink.used && start && (
        <ContainerForMathTest
          selectedVariant={testLink.variantId}
          endTest={endTest}
        ></ContainerForMathTest>
      )}
    </div>
  );
};
export default OneTimeTest;
