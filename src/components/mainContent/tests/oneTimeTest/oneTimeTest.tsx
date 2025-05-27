import { useState, useEffect } from "react";
import { db } from "../../../../firebaseConfig";
import { getDoc, doc, addDoc, collection, updateDoc } from "firebase/firestore";

import ContainerForMathTest from "../containerForMathTests";
type TestLink = {
  variantId: string;
  isUsed: boolean;
};
const OneTimeTest = (props: { selectedLink: string }) => {
  const [testLink, setTestLink] = useState<TestLink | null>(null);
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
        setTestLink(data);
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

      await updateDoc(resultsRef, {
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

      {testLink && !testLink.isUsed && start && (
        <ContainerForMathTest
          selectedVariant={testLink.variantId}
          endTest={endTest}
        ></ContainerForMathTest>
      )}
    </div>
  );
};
export default OneTimeTest;
