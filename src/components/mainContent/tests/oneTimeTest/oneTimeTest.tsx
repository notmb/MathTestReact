import { useState, useEffect } from "react";
import { db } from "../../../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import MathTest from "../mathTests";
type TestLink = {
  variantId: string;
  isUsed: boolean;
};
const OneTimeTest = (props: { selectedLink: string }) => {
  const [testLink, setTestLink] = useState<TestLink | null>(null);
  const [start, setStart] = useState<boolean>(false);

  useEffect(() => {
    console.log(props.selectedLink);
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
          ></input>
          <button
            type="button"
            form="form_for_user_name"
            className="custom_button"
            onClick={() => setStart(true)}
          >
            Почати тест
          </button>
        </form>
      )}
      {testLink && !testLink.isUsed && start && (
        <MathTest selectedVariant={testLink.variantId}></MathTest>
      )}
    </div>
  );
};
export default OneTimeTest;
