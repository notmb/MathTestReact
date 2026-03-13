import TestResults from "../testResults";
import CreatorNewLinkForStudent from "./creatorNewLinkForSt";
import "./styleOneTime.css";
import { useEffect, useState } from "react";
import { WrapperForModalWindow } from "../../reactTsUtils";
import { useImmer } from "use-immer";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

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

type FetchStatus = "loading" | "success" | "error";

const OneTimeLinks = (props: { selectedVariant: string }) => {
  const [testLinks, updateTestLinks] = useImmer<TestLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOFAddingLinkOpen, setIsModalOFAddingLinkOpen] = useState(false);
  const [selectedAnswersData, updateSelectedAnswersData] =
    useImmer<SelectedLink | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTestLinks = async () => {
    setFetchStatus("loading");
    setErrorMessage(null);

    const testLinksRef = collection(db, "Subjects", "Math", "TestLinks");
    const dataLinks = query(
      testLinksRef,
      where("variantId", "==", props.selectedVariant),
    );

    try {
      const querySnapshot = await getDocs(dataLinks);

      const links: TestLink[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TestLink[];

      updateTestLinks(links);
      setFetchStatus("success");
    } catch (error) {
      console.error("Помилка при отриманні документів:", error);
      setErrorMessage("Не вдалося завантажити одноразові лінки.");
      setFetchStatus("error");
    }
  };

  useEffect(() => {
    fetchTestLinks();
  }, [props.selectedVariant]);

  const copyLink = async (idLink: string) => {
    const link = `${window.location.origin}/MathTestReact/${idLink}/one-time-link`;

    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(idLink);
      setTimeout(() => {
        setCopiedLinkId((current) => (current === idLink ? null : current));
      }, 2000);
    } catch (error) {
      console.error("Не вдалося скопіювати лінк:", error);
    }
  };

  const removeLink = async (linkId: string) => {
    try {
      const linkPath = `Subjects/Math/TestLinks/${linkId}`;
      // 1. Знайти єдиний документ у підколекції testResults
      const resultsColRef = collection(db, linkPath, "testResults");
      const resultsSnap = await getDocs(resultsColRef);

      if (!resultsSnap.empty) {
        const resultDoc = resultsSnap.docs[0];
        await deleteDoc(resultDoc.ref);
      }

      // 2. Видалити сам документ
      await deleteDoc(doc(db, linkPath));

      // 3. Оновити стан
      updateTestLinks((draft) => {
        const itemIndex = draft.findIndex((item) => item.id === linkId);
        if (itemIndex !== -1) {
          draft.splice(itemIndex, 1);
        }
      });

      console.log(`Документ ${linkId} і testResults успішно видалені`);
    } catch (error) {
      console.error("Помилка при видаленні документа:", error);
    }
  };

  const openResults = (selectedLink: string, nameStudent: string) => {
    setIsModalOpen(true);
    updateSelectedAnswersData(() => ({
      selectedLink: selectedLink,
      nameStudent: nameStudent,
    }));
  };

  return (
    <div className="one-time-links">
      <div className="one-time-links-toolbar">
        <button
          className="one-time-links-create-btn"
          onClick={() => setIsModalOFAddingLinkOpen(true)}
        >
          Створити Link
        </button>
      </div>

      {fetchStatus === "loading" && (
        <p className="one-time-links-state one-time-links-state-loading">
          Завантаження лінків...
        </p>
      )}
      {fetchStatus === "error" && errorMessage && (
        <p className="one-time-links-state one-time-links-state-error">
          {errorMessage}
        </p>
      )}
      {fetchStatus === "success" && testLinks.length === 0 && (
        <p className="one-time-links-state one-time-links-state-empty">
          Для цього варіанту ще немає одноразових лінків.
        </p>
      )}

      <p className="one-time-links-title">ONE TIME LINKS:</p>

      {fetchStatus === "success" &&
        testLinks.length > 0 &&
        testLinks.map((item) => {
          return (
            <div className="one-time-links-item" key={item.id}>
              <p className="one-time-links-item-id">{item.id}</p>
              <p className="one-time-links-item-meta">
                <span className="one-time-links-item-label">Учень:</span>{" "}
                {item.nameStudent}
              </p>
              <p className="one-time-links-item-meta">
                <span className="one-time-links-item-label">Стан:</span>{" "}
                {item.used === false
                  ? "не пройдено"
                  : `пройдено, результат: ${item.testResult}`}
              </p>

              <div className="one-time-links-actions">
                <div className="one-time-links-copy-block">
                  {copiedLinkId !== item.id && (
                    <button
                      onClick={() => copyLink(item.id)}
                      className="one-time-links-btn"
                    >
                      Скопіювати лінк
                    </button>
                  )}
                  {copiedLinkId === item.id && (
                    <p className="one-time-links-copy-status">
                      Лінк скопійовано
                    </p>
                  )}
                </div>
                {item.used === true && (
                  <button
                    className="one-time-links-btn"
                    onClick={() => openResults(item.id, item.nameStudent)}
                  >
                    Переглянути результати
                  </button>
                )}
                <button
                  onClick={() => removeLink(item.id)}
                  className="one-time-links-btn one-time-links-btn-danger"
                >
                  Видалити Link
                </button>
              </div>
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
