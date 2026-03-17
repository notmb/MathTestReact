import { useState, useEffect } from "react";
import { db } from "../../../../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useImmer } from "use-immer";
import { useVariantContext } from "../variantContext";

type StudentOption = {
  id: string;
  name: string;
};

interface TestLink {
  id: string; // id посилання
  variantId: string; // id варіанту
  typeTest: string;
  used: boolean;
  nameStudent: string;
  testResult: string;
  // інші поля, які є в документі
}

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

        const list: StudentOption[] = snapshot.docs
          .map((doc) => {
            const data = doc.data() as { name?: unknown };
            const name = typeof data.name === "string" ? data.name.trim() : "";

            return name ? { id: doc.id, name } : null;
          })
          .filter((item): item is StudentOption => item !== null);

        updateStudents((draft) => {
          draft.length = 0;
          list.forEach((student) => draft.push(student));
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

    const linkDocId = `${selectedStudentId}_${props.selectedVariant}`;
    const docRef = doc(db, "Subjects", "Math", "TestLinks", linkDocId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      alert("Посилання для цього учня і варіанта вже існує");
      return;
    }

    try {
      const docRefStudent = doc(
        db,
        "Subjects",
        "Math",
        "MyStudents",
        selectedStudentId,
      );
      const property =
        dataVariant?.typeTest === "retaking"
          ? "testScoresRetaking"
          : "testScores";

      await updateDoc(docRefStudent, {
        [`${property}.${dataVariant.variantSerialNumber}`]: "не почато",
      });
      console.log(`Поле ${property} оновлено`);
      const resultTestDocRef = doc(
        collection(docRefStudent, "ResultsTest"),
        props.selectedVariant,
      );
      await setDoc(resultTestDocRef, {
        userAnswers: {},
        result: "не пройдено",
        pointsForTasks: {},
        variantId: props.selectedVariant,
        variantName: dataVariant.variantSerialNumber || dataVariant.variantName,
      });
      console.log("Документ ResultsTest створено або оновлено");

      await setDoc(docRef, {
        createdAt: serverTimestamp(),
        typeTest: dataVariant.typeTest || "main",
        variantSerialNumber: dataVariant.variantSerialNumber,
        durationSec: 3600,
        testLinkStatus: "notStarted",
        used: false,
        studentId: selectedStudentId,
        nameStudent:
          students.find((s) => s.id === selectedStudentId)?.name || "",
        variantId: props.selectedVariant,
        testResult: "-",
      });
      props.updateTestLinks({
        id: linkDocId,
        variantId: props.selectedVariant,
        typeTest: dataVariant.typeTest || "main",
        used: false,
        nameStudent:
          students.find((s) => s.id === selectedStudentId)?.name || "",
        testResult: "не пройдено",
      } as TestLink);
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
