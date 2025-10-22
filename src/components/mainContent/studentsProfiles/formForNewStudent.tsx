import { useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddNewStudent = (props: {
  onSuccess: () => void;
  updeteListStudents: (draft: {
    name: string;
    testScores: {
      [key: string]: string;
    };
    testScoresRetaking: {
      [key: string]: string;
    };
    id: string;
  }) => void;
}) => {
  //
  const [name, setName] = useState("");
  const [testResults, setTestResults] = useState("");
  const [testResultsRetaking, setTestResultsRetaking] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const arrTestResults =
      testResults.trim() === ""
        ? []
        : testResults.split(";").map((item) => item.trim());
    const arrTestResultsRetaking =
      testResults.trim() === ""
        ? []
        : testResults.split(";").map((item) => item.trim());

    // Генеруємо testScores: { topic1: "...", topic2: "...", ... }
    const testScores: { [key: string]: string } = {};
    const testScoresRetaking: { [key: string]: string } = {};

    if (arrTestResults.length > 0) {
      arrTestResults.forEach((result, index) => {
        testScores[`topic${index + 1}`] = result;
      });
    } else {
      // testScores залишиться пустим об'єктом {}
    }

    if (arrTestResultsRetaking.length > 0) {
      arrTestResultsRetaking.forEach((result, index) => {
        testScoresRetaking[`topic${index + 1}`] = result;
      });
    } else {
      // testScoresRetaking залишиться пустим об'єктом {}
    }

    // Тут можна відправити дані кудись або передати наверх
    try {
      const docRef = await addDoc(
        collection(db, "Subjects", "Math", "MyStudents"),
        {
          name: name,
          testScores: testScores,
          testScoresRetaking: testScoresRetaking,
          createdAt: new Date(),
        }
      );
      props.updeteListStudents({
        name: name,
        testScores: testScores,
        testScoresRetaking: testScoresRetaking,
        id: docRef.id,
      });
    } catch (error) {
      console.error("Помилка при збереженні учня:", error);
      alert("Не вдалося зберегти.");
    }

    props.onSuccess(); // закрити модалку
  };

  return (
    <div className="box_for_form_for_add_student  mt-4">
      <form className="form_for_add_student" onSubmit={handleSubmit}>
        <div className="containet_for_input">
          <label>Ім'я учня:</label>
          <input
            className="w-1/2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="containet_for_input">
          <label>Результати (розділяємо ';') тестів (необов’язково):</label>
          <textarea
            value={testResults}
            onChange={(e) => setTestResults(e.target.value)}
          />
        </div>
        <div className="containet_for_input">
          <label>
            Результати (розділяємо ';') перездачі тестів (необов’язково):
          </label>
          <textarea
            value={testResultsRetaking}
            onChange={(e) => setTestResultsRetaking(e.target.value)}
          />
        </div>

        <button type="submit" className="self-start">
          Зберегти
        </button>
      </form>
    </div>
  );
};
export default AddNewStudent;
