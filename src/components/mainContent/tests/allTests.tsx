import "./style.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useState, useEffect } from "react";

const AllTest = (props: { navigate: (path: string) => void }) => {
  const [variantsIsSorted, setVariantsIsSorted] = useState<
    { id: string; name: string; variantSerialNumber: string }[]
  >([]);

  const [variantsRetakingIsSorted, setVariantsRetakingIsSorted] = useState<
    { id: string; name: string; variantSerialNumber: string }[]
  >([]);

  const getAllVariants = async () => {
    const variantsRef = collection(
      db,
      "Subjects",
      "Math",
      "Algebra",
      "Topics",
      "Mix"
    );
    try {
      const snapshot = await getDocs(variantsRef);
      const variants = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.variantName || doc.id,
          variantSerialNumber: data.variantSerialNumber,
        };
      });
      console.log(variants);
      return variants;
    } catch (error) {
      console.log("Помилка при завантаженні варіантів:", error);
      return [];
    }
  };

  const getAllVariantsRetaking = async () => {
    const variantsRetakingRef = collection(
      db,
      "Subjects",
      "Math",
      "Algebra",
      "Topics",
      "Retaking"
    );
    try {
      const snapshot = await getDocs(variantsRetakingRef);
      const variantsRetaking = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.variantName || doc.id,
          variantSerialNumber: data.variantSerialNumber,
        };
      });
      return variantsRetaking;
    } catch (error) {
      console.log("Помилка при завантаженні варіантів:", error);
      return [];
    }
  };

  function sortByVariantNumber(
    arr: { id: string; name: string; variantSerialNumber: string }[]
  ): { id: string; name: string; variantSerialNumber: string }[] {
    return [...arr].sort((a, b) => {
      const numA = parseInt(a.variantSerialNumber.match(/\d+/)?.[0] ?? "0", 10);
      const numB = parseInt(b.variantSerialNumber.match(/\d+/)?.[0] ?? "0", 10);
      return numA - numB;
    });
  }

  //завантажуємо основні варіанти
  useEffect(() => {
    const fetchVariants = async () => {
      const data = await getAllVariants();
      setVariantsIsSorted(sortByVariantNumber(data));
    };
    fetchVariants();
  }, []);

  //завантажуємо варіанти для перездачі
  useEffect(() => {
    const fetchVariantsRetaking = async () => {
      const data = await getAllVariantsRetaking();
      setVariantsRetakingIsSorted(sortByVariantNumber(data));
    };
    fetchVariantsRetaking();
  }, []);

  const selectTest = (idTest: string, type: "main" | "retaking") => {
    props.navigate(`/MathTestReact/allTest/selectedVariant/${type}/${idTest}`);
  };

  return (
    <div className="box_for_list_of_tests">
      <div>
        <ul className="list_of_variant">
          <h3>Тести:</h3>

          {variantsIsSorted.map((variant) => (
            <li className="variant_item" key={variant.id}>
              <p
                className="cursor-pointer m-1"
                onClick={() => selectTest(variant.id, "main")}
              >
                {variant.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul className="list_of_variant">
          <h3>Тести на перездачу:</h3>
          {variantsRetakingIsSorted.map((variant) => (
            <li className="variant_item" key={variant.id}>
              <p
                className="cursor-pointer m-1"
                onClick={() => selectTest(variant.id, "retaking")}
              >
                {variant.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default AllTest;
