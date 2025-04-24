import "./style.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useState, useEffect } from "react";
import MathTest from "./mathTests";
const AllTest = (props: { navigate: (path: string) => void }) => {
  const [variants, setVariants] = useState<{ id: string; name: string }[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const getAllVariants = async () => {
    const tasksRef = collection(
      db,
      "Subjects",
      "Math",
      "Algebra",
      "Topics",
      "Mix"
    );
    try {
      const snapshot = await getDocs(tasksRef);
      const variants = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, name: data.name || doc.id };
      });
      console.log(variants);
      return variants;
    } catch (error) {
      console.log("Помилка при завантаженні варіантів:", error);
      return [];
    }
  };
  useEffect(() => {
    const fetchVariants = async () => {
      const data = await getAllVariants();
      setVariants(data);
    };

    fetchVariants();
  }, []);
  const selectTest = (nameTest: string) => {
    setSelectedVariant(nameTest);
    props.navigate(`/MathTestReact/allTest/${nameTest}`);
  };
  console.log(selectedVariant);
  return (
    <div className="box_for_list_of_tests">
      <div
        className={!selectedVariant ? "conteiner_for_variant_list" : "hidden"}
      >
        <ul className="list_of_variant">
          {variants.map((variant) => (
            <li
              className="variant_item"
              key={variant.id}
              onClick={() => {
                selectTest(variant.name);
              }}
            >
              {variant.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedVariant && (
        <MathTest selectedVariant={selectedVariant}></MathTest>
      )}
    </div>
  );
};
export default AllTest;
