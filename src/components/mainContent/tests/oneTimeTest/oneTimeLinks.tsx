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
  // інші поля, які є в документі
}
const OneTimeLinks = (props: { selectedVariant: string }) => {
  const [testLinks, updateTestLinks] = useImmer<TestLink[]>([]);

  const fetchTestLinks = async () => {
    const testLinksRef = collection(db, "Subjects", "Math", "TestLinks");
    const q = query(
      testLinksRef,
      where("variantId", "==", props.selectedVariant)
    );

    try {
      const querySnapshot = await getDocs(q);

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
      const docRef = await addDoc(newLink, {
        variantId: props.selectedVariant,
        createdAt: new Date(),
        used: false,
      });
      updateTestLinks([
        ...testLinks,
        {
          id: docRef.id,
          variantId: props.selectedVariant,
          used: false,
        },
      ]);
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

  return (
    <div className="one-time-links">
      <button onClick={addLink}>Cтворити Link</button>
      <p>ONE TIME LINKS:</p>
      {testLinks.length > 0 &&
        testLinks.map((item, index) => {
          return (
            <div className="border border-black" key={item.id}>
              <span onClick={() => getLink(item.id)}>
                <p>{item.id}</p> <p>{item.used.toString()}</p>
              </span>
              <button
                onClick={() => removeLink(item.id, index)}
                className="m-2"
              >
                Видалити Link{" "}
              </button>
            </div>
          );
        })}
    </div>
  );
};
export default OneTimeLinks;
