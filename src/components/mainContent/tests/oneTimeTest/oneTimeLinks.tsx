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
import { useAuth } from "../../../../auth/useAuth";

interface TestLink {
  id: string; // id посилання
  variantId: string; // id варіанту
  typeTest: string;
  used: boolean;
  nameStudent: string;
  testResult: string;
  // інші поля, які є в документі
}

type FetchStatus = "loading" | "success" | "error";

const OneTimeLinks = (props: {
  selectedVariant: string;
  navigate?: (path: string) => void;
}) => {
  const [testLinks, updateTestLinks] = useImmer<TestLink[]>([]);
  const [isModalOFAddingLinkOpen, setIsModalOFAddingLinkOpen] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, isDemo } = useAuth();

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
      setErrorMessage("Не вдалося завантажити одноразові посилання.");
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
      console.error("Не вдалося скопіювати посилання:", error);
    }
  };

  const removeLink = async (linkId: string) => {
    if (!user) {
      alert("You need to log in to perform this action");
      return;
    }
    if (isDemo) {
      alert("This action is not available in demo mode.");
      return;
    }
    try {
      const linkPath = `Subjects/Math/TestLinks/${linkId}`;
      const resultsColRef = collection(db, linkPath, "testResults");
      const resultsSnap = await getDocs(resultsColRef);

      if (!resultsSnap.empty) {
        const resultDoc = resultsSnap.docs[0];
        await deleteDoc(resultDoc.ref);
      }

      await deleteDoc(doc(db, linkPath));

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

  const openResults = (selectedLink: string) => {
    if (!props.navigate) {
      return;
    }

    const searchParams = new URLSearchParams({
      link: selectedLink,
    });

    props.navigate(
      `${window.location.pathname}/results?${searchParams.toString()}`,
    );
  };

  return (
    <div className="one-time-links">
      <div className="one-time-links-toolbar">
        <button
          className="one-time-links-create-btn"
          onClick={() => setIsModalOFAddingLinkOpen(true)}
        >
          Створити посилання
        </button>
      </div>

      {fetchStatus === "loading" && (
        <p className="one-time-links-state one-time-links-state-loading">
          Завантаження посилань...
        </p>
      )}
      {fetchStatus === "error" && errorMessage && (
        <p className="one-time-links-state one-time-links-state-error">
          {errorMessage}
        </p>
      )}
      {fetchStatus === "success" && testLinks.length === 0 && (
        <p className="one-time-links-state one-time-links-state-empty">
          Для цього варіанту ще немає одноразових посилань.
        </p>
      )}

      <p className="one-time-links-title">ОДНОРАЗОВІ ПОСИЛАННЯ:</p>

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
                      Скопіювати посилання
                    </button>
                  )}
                  {copiedLinkId === item.id && (
                    <p className="one-time-links-copy-status">
                      Посилання скопійовано
                    </p>
                  )}
                </div>
                {item.used === true && (
                  <button
                    className="one-time-links-btn"
                    onClick={() => openResults(item.id)}
                  >
                    Переглянути результати
                  </button>
                )}
                <button
                  onClick={() => removeLink(item.id)}
                  className="one-time-links-btn one-time-links-btn-danger"
                >
                  Видалити посилання
                </button>
              </div>
            </div>
          );
        })}

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
