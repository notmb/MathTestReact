import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import MathTest from "../mathTests";

interface TestLink {
  id: string;
  variantId: string;
  used: boolean;
  // інші поля, які є в документі
}
const OneTimeLinks = (props: { selectedVariant: string }) => {
  const [start, setStart] = useState<boolean>(false);

  const [testLinks, setTestLinks] = useState<TestLink[]>([]);

  // const [oneTimeLink, setOneTimeLink] = useState<string | null>(null);

  useEffect(() => {
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

        setTestLinks(links);
      } catch (error) {
        console.error("Помилка при отриманні документів:", error);
      }
    };

    fetchTestLinks();
  }, []);

  const getLink = (idLink: string) => {
    alert(
      `твій лінк на тест - http://localhost:5173/MathTestReact/${idLink}/one-time-test`
    );
  };

  console.log(testLinks);
  const CheckAdmittance = () => {
    if (testLinks.length > 0 && testLinks[0].used) {
      setStart(true);
    }
  };
  console.log(start);
  return (
    <div>
      <p>One TIME LINKS</p>
      {testLinks.map((item, index) => {
        return (
          <div
            className="border border-black"
            onClick={() => getLink(item.id)}
            key={index}
          >
            <p>{item.id}</p> <p>{item.used.toString()}</p>
          </div>
        );
      })}

      {!start && <button onClick={CheckAdmittance}>РОЗПОЧАТИ ТЕСТ</button>}
      {start && <MathTest selectedVariant={props.selectedVariant}></MathTest>}
    </div>
  );
};
export default OneTimeLinks;
