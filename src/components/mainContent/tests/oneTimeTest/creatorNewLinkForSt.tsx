import { useState, useEffect } from "react";
import { db } from "../../../../firebaseConfig"; // твоя ініціалізація firebase
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useImmer } from "use-immer";

type StudentOption = {
  id: string;
  name: string;
};
interface TestLink {
  id: string; // id лінку
  variantId: string; // id варіанту
  typeTest: string;
  used: boolean;
  nameStudent: string;
  testResult: string;
  // інші поля, які є в документі
}

import { useVariantContext } from "../variantContext";

const CreatorNewLinkForStudent = (props: {
  selectedVariant: string;
  onClose: () => void;
  updateTestLinks: (dataLink: TestLink) => void;
}) => {
  const [students, updateStudents] = useImmer<StudentOption[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { dataVariant } = useVariantContext();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const colRef = collection(db, "Subjects", "Math", "MyStudents");
        const snapshot = await getDocs(colRef);

        // Створюємо список учнів із документів Firestore
        const list: StudentOption[] = snapshot.docs
          .map((doc) => {
            // Беремо дані документа
            const data = doc.data() as { name?: unknown };

            // Перевіряємо, чи є поле name рядком і прибираємо зайві пробіли
            const name = typeof data.name === "string" ? data.name.trim() : "";

            // Якщо name валідне, повертаємо об’єкт {id, name}, інакше — null
            return name ? { id: doc.id, name } : null;
          })
          // Видаляємо всі null, залишаємо лише валідні об’єкти
          .filter((item): item is StudentOption => item !== null);

        // Оновлюємо стан students через useImmer
        updateStudents((draft) => {
          draft.length = 0; // Очищаємо попередній стан
          list.forEach((student) => draft.push(student)); // Додаємо нові значення
        });
      } catch (err) {
        console.error("Помилка завантаження учнів:", err);
        setError("Не вдалося завантажити список учнів.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const addLink = async () => {
    if (!selectedStudentId) {
      alert("Оберіть учня перед додаванням");
      return;
    }
    console.log(selectedStudentId);

    const linkDocId = `${selectedStudentId}_${props.selectedVariant.slice(
      0,
      -1
    )}`;
    const docRef = doc(db, "Subjects", "Math", "TestLinks", linkDocId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      alert("Лінк для цього учня і варіанта вже існує");
      return;
    }

    try {
      // Оновлюємо testScores в профілі учня
      const docRefStudent = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        selectedStudentId
      );
      await updateDoc(docRefStudent, {
        [`testScores.${dataVariant.variantSerialNumber}`]: "не почато",
      });
      console.log("Поле testScores оновлено");

      //в профілі учня створюємо або редагуємо колекцію ResultsTest - детальні результати тесту
      const resultTestDocRef = doc(
        collection(docRefStudent, "ResultsTest"),
        props.selectedVariant.slice(0, -1)
      );
      await setDoc(resultTestDocRef, {
        userAnswers: {},
        result: "не пройдено",
        pointsForTasks: {},
        variantId: props.selectedVariant.slice(0, -1),
        variantName: dataVariant.variantSerialNumber || dataVariant.variantName,
      });
      console.log("Документ ResultsTest створено/оновлено");

      // Додаємо документ (дані лінки) у TestLinks
      await setDoc(docRef, {
        studentId: selectedStudentId,
        typeTest: props.selectedVariant.slice(-1) === "M" ? "main" : "retaking",
        nameStudent:
          students.find((s) => s.id === selectedStudentId)?.name || "",
        variantId: props.selectedVariant.slice(0, -1),
        testResult: "не пройдено",
        used: false,
        createdAt: new Date(),
      });
      console.log("Лінка додана");

      // interface TestLink {
      //   id: string; // id лінку
      //   variantId: string; // id варіанту
      //   used: boolean;
      //   nameStudent: string;
      //   testResult: string;
      //   // інші поля, які є в документі
      // }

      //оновлюємо локальний список лінків
      props.updateTestLinks({
        id: linkDocId,
        variantId: props.selectedVariant.slice(0, -1),
        typeTest: props.selectedVariant.slice(-1) === "M" ? "main" : "retaking",
        used: false,
        nameStudent:
          students.find((s) => s.id === selectedStudentId)?.name || "",
        testResult: "не пройдено",
      } as TestLink);
      // Закриваємо модалку
      props.onClose();
    } catch (error) {
      console.error("Помилка створення:", error);
    }
  };

  return (
    <div>
      {loading && <p>Завантаження учнів...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          <option value="">Оберіть учня</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      )}
      <button onClick={addLink}>Додати</button>
    </div>
  );
};
export default CreatorNewLinkForStudent;
