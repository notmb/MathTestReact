import TestResults from "../testResults";
import CreatorNewLinkForStudent from "./creatorNewLinkForSt";
import { useEffect, useState } from "react";
// import { useVariantContext } from "../variantContext";
import { WrapperForModalWindow } from "../../reactTsUtils";
import { useImmer } from "use-immer";
import {
  collection,
  // setDoc,
  // updateDoc,
  query,
  where,
  getDocs,
  // addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
// import { findDocIdByField } from "../../firebaseUtils";

interface TestLink {
  id: string; // id лінку
  variantId: string; // id варіанту
  typeTest: string;
  used: boolean;
  nameStudent: string;
  testResult: string;
  // інші поля, які є в документі
}
interface SelectedLink {
  selectedLink: string;
  nameStudent: string;
}

const OneTimeLinks = (props: { selectedVariant: string }) => {
  const [testLinks, updateTestLinks] = useImmer<TestLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOFAddingLinkOpen, setIsModalOFAddingLinkOpen] = useState(false);

  const [selectedAnswersData, updateSelectedAnswersData] =
    useImmer<SelectedLink | null>(null);

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

  const host = window.location.host;
  const getLink = (idLink: string) => {
    alert(
      `твій лінк на тест - http://${host}/MathTestReact/${idLink}/one-time-test`
    );
  };

  const removeLink = async (link: string, index: number) => {
    try {
      const linkPath = `Subjects/Math/TestLinks/${link}`;
      //  🔹 1. Знайти єдиний документ у підколекції testResults
      const resultsColRef = collection(db, linkPath, "testResults");
      const resultsSnap = await getDocs(resultsColRef);
      if (!resultsSnap.empty) {
        const resultDoc = resultsSnap.docs[0];
        await deleteDoc(resultDoc.ref);
      }
      // 🔹 2. Видалити сам документ
      await deleteDoc(doc(db, linkPath));
      // 🔹 3. Оновити стан
      updateTestLinks((draft) => {
        draft.splice(index, 1);
      });
      console.log(`✅ Документ ${link} і testResults успішно видалені`);
    } catch (error) {
      console.error("Помилка при видаленні документа:", error);
    }
  };

  const ViewTheResults = (selectedLink: string, nameStudent: string) => {
    setIsModalOpen(true);
    updateSelectedAnswersData(() => ({
      selectedLink: selectedLink,
      nameStudent: nameStudent,
    }));
  };

  return (
    <div className="one-time-links">
      <button onClick={() => setIsModalOFAddingLinkOpen(true)}>
        Cтворити Link
      </button>
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
                <button
                  className="m-2"
                  onClick={() => ViewTheResults(item.id, item.nameStudent)}
                >
                  Переглянутити результати
                </button>
              )}
            </div>
          );
        })}
      {isModalOpen && selectedAnswersData && (
        <TestResults
          onClose={() => setIsModalOpen(false)}
          variantId={props.selectedVariant}
          nameStudent={selectedAnswersData.nameStudent}
          selectedLink={selectedAnswersData.selectedLink}
        />
      )}
      {isModalOFAddingLinkOpen && (
        <WrapperForModalWindow
          onClose={() => setIsModalOFAddingLinkOpen(false)}
        >
          <CreatorNewLinkForStudent
            selectedVariant={props.selectedVariant}
            onClose={() => setIsModalOFAddingLinkOpen(false)}
            updateTestLinks={(dataLink) => {
              updateTestLinks((draft) => {
                draft.push(dataLink);
              });
            }}
          />
        </WrapperForModalWindow>
      )}
    </div>
  );
};
export default OneTimeLinks;
