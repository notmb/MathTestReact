import "./style.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useState, useEffect } from "react";

const AllTest = (props: { navigate: (path: string) => void }) => {
  const [variants, setVariants] = useState<{ id: string; name: string }[]>([]);
  const [variantsRetaking, setVariantsRetaking] = useState<
    { id: string; name: string }[]
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
        return { id: doc.id, name: data.variantName || doc.id };
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
        return { id: doc.id, name: data.variantName || doc.id };
      });
      console.log(variantsRetaking);
      return variantsRetaking;
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

  useEffect(() => {
    const fetchVariantsRetaking = async () => {
      const data = await getAllVariantsRetaking();
      setVariantsRetaking(data);
    };
    fetchVariantsRetaking();
  }, []);

  const selectTest = (IdTest: string) => {
    props.navigate(`/MathTestReact/allTest/selectedVariant/${IdTest}`);
  };

  return (
    <div className="box_for_list_of_tests">
      <div>
        <ul className="list_of_variant">
          <h3>Тести:</h3>

          {variants.map((variant) => (
            <li className="variant_item" key={variant.id}>
              <p
                className="cursor-pointer m-1"
                onClick={() => {
                  selectTest(variant.id + "M");
                }}
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
          {variantsRetaking.map((variant) => (
            <li className="variant_item" key={variant.id}>
              <p
                className="cursor-pointer m-1"
                onClick={() => {
                  selectTest(variant.id + "R");
                }}
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
