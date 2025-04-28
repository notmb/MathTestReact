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

  const selectTest = (IdTest: string) => {
    setSelectedVariant(IdTest);
    props.navigate(`/MathTestReact/allTest/${IdTest}`);
  };

  return (
    <div className="box_for_list_of_tests">
      <div
        className={!selectedVariant ? "conteiner_for_variant_list" : "hidden"}
      >
        <ol className="list_of_variant">
          {variants.map((variant) => (
            <li className="variant_item" key={variant.id}>
              <p
                className="cursor-pointer m-1"
                onClick={() => {
                  selectTest(variant.id);
                }}
              >
                {variant.name}
              </p>
            </li>
          ))}
        </ol>
      </div>
      {selectedVariant && (
        <MathTest selectedVariant={selectedVariant}></MathTest>
      )}
    </div>
  );
};
export default AllTest;
