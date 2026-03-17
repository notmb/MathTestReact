import "./tests.style.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useState, useEffect } from "react";

type VariantItem = {
  id: string;
  name: string;
  variantSerialNumber: string;
};

const AllTest = (props: { navigate: (path: string) => void }) => {
  const [variantsIsSorted, setVariantsIsSorted] = useState<VariantItem[]>([]);
  const [isLoadingMain, setIsLoadingMain] = useState(true);
  const [mainError, setMainError] = useState("");

  const [variantsRetakingIsSorted, setVariantsRetakingIsSorted] = useState<
    VariantItem[]
  >([]);
  const [isLoadingRetaking, setIsLoadingRetaking] = useState(true);
  const [retakingError, setRetakingError] = useState("");

  const getVariants = async (topic: "Mix" | "Retaking") => {
    const variantsRef = collection(
      db,
      "Subjects",
      "Math",
      "Algebra",
      "Topics",
      topic
    );
    const snapshot = await getDocs(variantsRef);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.variantName || doc.id,
        variantSerialNumber: String(data.variantSerialNumber ?? ""),
      };
    });
  };

  function sortByVariantNumber(arr: VariantItem[]): VariantItem[] {
    return [...arr].sort((a, b) => {
      const numA = parseInt(a.variantSerialNumber?.match(/\d+/)?.[0] ?? "0", 10);
      const numB = parseInt(b.variantSerialNumber?.match(/\d+/)?.[0] ?? "0", 10);
      return numA - numB;
    });
  }

  useEffect(() => {
    const fetchVariants = async () => {
      setIsLoadingMain(true);
      setMainError("");

      try {
        const data = await getVariants("Mix");
        setVariantsIsSorted(sortByVariantNumber(data));
      } catch (error) {
        console.error("Не вдалося завантажити список тестів:", error);
        setMainError("Не вдалося завантажити список тестів.");
      } finally {
        setIsLoadingMain(false);
      }
    };

    fetchVariants();
  }, []);

  useEffect(() => {
    const fetchVariantsRetaking = async () => {
      setIsLoadingRetaking(true);
      setRetakingError("");

      try {
        const data = await getVariants("Retaking");
        setVariantsRetakingIsSorted(sortByVariantNumber(data));
      } catch (error) {
        console.error("Не вдалося завантажити список тестів на перездачу:", error);
        setRetakingError("Не вдалося завантажити список тестів на перездачу.");
      } finally {
        setIsLoadingRetaking(false);
      }
    };

    fetchVariantsRetaking();
  }, []);

  const selectTest = (idTest: string, type: "main" | "retaking") => {
    props.navigate(`/MathTestReact/allTest/selectedVariant/${type}/${idTest}`);
  };

  return (
    <div className="box-for-list-of-tests">
      <div>
        <h3>Тести:</h3>
        <ul className="list-of-variant">
          {isLoadingMain ? (
            <li>Завантаження тестів...</li>
          ) : mainError ? (
            <li>{mainError}</li>
          ) : variantsIsSorted.length === 0 ? (
            <li>Список тестів порожній.</li>
          ) : (
            variantsIsSorted.map((variant) => (
              <li className="variant-item" key={variant.id}>
                <button
                  type="button"
                  className="variant-button"
                  onClick={() => selectTest(variant.id, "main")}
                >
                  {variant.name}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      <div>
        <h3>Тести на перездачу:</h3>
        <ul className="list-of-variant">
          {isLoadingRetaking ? (
            <li>Завантаження тестів на перездачу...</li>
          ) : retakingError ? (
            <li>{retakingError}</li>
          ) : variantsRetakingIsSorted.length === 0 ? (
            <li>Список тестів на перездачу порожній.</li>
          ) : (
            variantsRetakingIsSorted.map((variant) => (
              <li className="variant-item" key={variant.id}>
                <button
                  type="button"
                  className="variant-button"
                  onClick={() => selectTest(variant.id, "retaking")}
                >
                  {variant.name}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AllTest;
