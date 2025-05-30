import { useEffect } from "react";
import { useImmer } from "use-immer";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

interface TestLink {
  id: string; // id лінку
  variantId: string; // id варіанту
  used: boolean;
  nameStudent: string;
  testResult: string;
  // інші поля, які є в документі
}

// interface TestResults {
//   pointsForTasks: { [key: string]: string };
//   result: string;
//   userAnswer: { [key: string]: string | { [key: string]: string } };
// }

const OneTimeLinks = (props: { selectedVariant: string }) => {
  const [testLinks, updateTestLinks] = useImmer<TestLink[]>([]);
  // const [testUserResult, updeteTestUserResult] = useImmer<TestResults>({
  //   pointsForTasks: {},
  //   result: "",
  //   userAnswer: {},
  // });
  const fetchTestLinks = async () => {
    const testLinksRef = collection(db, "Subjects", "Math", "TestLinks");
    const dataLinks = query(
      testLinksRef,
      where("variantId", "==", props.selectedVariant)
    );
    try {
      const querySnapshot = await getDocs(dataLinks);

      const links: TestLink[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TestLink[];
      updateTestLinks(links);
    } catch (error) {
      console.error("Помилка при отриманні документів:", error);
    }
  };

  useEffect(() => {
    fetchTestLinks();
  }, []);

  const addLink = async () => {
    const newLink = collection(db, "Subjects", "Math", "TestLinks");
    try {
      const userName = prompt("Введіть ім'я учня:")?.trim() || "Не Вказано";
      const docRef = await addDoc(newLink, {
        variantId: props.selectedVariant,
        createdAt: new Date(),
        used: false,
        nameStudent: userName,
        testResult: "не пройдено",
      });
      updateTestLinks((draft) => {
        draft.push({
          id: docRef.id,
          variantId: props.selectedVariant,
          used: false,
          nameStudent: userName,
          testResult: "не пройдено",
        });
      });
      console.log("Користувача додано");
    } catch (error) {
      console.error("Помилка створення:", error);
    }
  };

  const host = window.location.host;
  const getLink = (idLink: string) => {
    alert(
      `твій лінк на тест - http://${host}/MathTestReact/${idLink}/one-time-test`
    );
  };

  const removeLink = async (link: string, index: number) => {
    await deleteDoc(doc(db, "Subjects", "Math", "TestLinks", link));
    updateTestLinks((draft) => {
      draft.splice(index, 1); // ✅ абсолютно нормально — Immer сам зробить копію
    });
  };

  // const getResults = async () => {
  //   const testResultsRef = collection(
  //     db,
  //     "Subjects",
  //     "Math",
  //     "TestLinks",
  //     "J88s5dtZFB5lKGwFDJgB",
  //     "testResults"
  //   );
  //   const snapshot = await getDocs(testResultsRef);
  //   if (!snapshot.empty) {
  //     const results = snapshot.docs[0];
  //   } else {
  //     console.log("No documents found");
  //   }
  // };

  return (
    <div className="one-time-links">
      <button onClick={addLink}>Cтворити Link</button>
      <p>ONE TIME LINKS:</p>
      {testLinks.length > 0 &&
        testLinks.map((item, index) => {
          return (
            <div className="border border-black" key={item.id}>
              <span onClick={() => getLink(item.id)}>
                <p>{item.id}</p>
                <p>Учень: {item.nameStudent}</p>
                <p>
                  {item.used === false
                    ? "не пройдено"
                    : `пройдено, результат: ${item.testResult}`}
                </p>
              </span>
              <button
                onClick={() => removeLink(item.id, index)}
                className="m-2"
              >
                Видалити Link
              </button>
              {item.used === true && (
                <button className="m-2">Переглянутити результати</button>
              )}
            </div>
          );
        })}
    </div>
  );
};
export default OneTimeLinks;
