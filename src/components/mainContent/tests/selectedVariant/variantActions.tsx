import { db } from "../../../../firebaseConfig";
import {
  deleteDoc,
  doc,
  addDoc,
  collection,
  writeBatch,
} from "firebase/firestore";
import type { VaiantData, Tasks } from "../../types";
import { useState } from "react";
import { WrapperForModalWindow } from "../../reactTsUtils";

interface VariantActionsProps {
  variant: string;
  dataVariant: VaiantData;
  tasks: Tasks;
}

const VariantActions = ({
  variant,
  dataVariant,
  tasks,
}: VariantActionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDoc(
        doc(
          db,
          "Subjects",
          "Math",
          "Algebra",
          "Topics",
          dataVariant.typeTest === "main" ? "Mix" : "Retaking",
          variant
        )
      );
      setIsDelete(true);
    } catch (e) {
      console.error("Помилка при видаленні:", e);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCopyToRetaking = async () => {
    try {
      const newVariantRef = await addDoc(
        collection(db, "Subjects", "Math", "Algebra", "Topics", "Retaking"),
        {
          variantName: dataVariant.variantName,
          variantSerialNumber: dataVariant.variantSerialNumber,
          numberOfTask: dataVariant.numberOfTasks,
          typeTest: "retaking",
          createdAt: new Date(),
        }
      );

      const batch = writeBatch(db);
      const newTasksRef = collection(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        "Retaking",
        newVariantRef.id,
        "tasks"
      );

      Object.entries(tasks).forEach(([id, task]) => {
        batch.set(doc(newTasksRef, id), task);
      });
      await batch.commit();
    } catch (e) {
      console.error("Помилка при копіюванні:", e);
    }
  };

  return (
    <div className="variant-actions">
      <button className="custom_button" onClick={handleCopyToRetaking}>
        Копіювати до перездачі
      </button>
      <button className="custom_button" onClick={() => setIsModalOpen(true)}>
        Видалити
      </button>

      {/* {isModalOpen && (
        <WrapperForModalWindow onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} />
      )} */}

      {isDelete && <p>✅ Варіант видалено</p>}
    </div>
  );
};
export default VariantActions;
