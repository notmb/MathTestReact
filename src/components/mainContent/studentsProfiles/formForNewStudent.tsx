import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useAuth } from "../../../auth/useAuth";

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
  const [name, setName] = useState("");
  const [testResults, setTestResults] = useState("");
  const [testResultsRetaking, setTestResultsRetaking] = useState("");
  const { user, isDemo } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You need to log in to perform this action");
      return;
    }
    if (isDemo) {
      alert("This action is not available in demo mode.");
      return;
    }

    const arrTestResults =
      testResults.trim() === ""
        ? []
        : testResults.split(";").map((item) => item.trim());
    const arrTestResultsRetaking =
      testResultsRetaking.trim() === ""
        ? []
        : testResultsRetaking.split(";").map((item) => item.trim());

    const testScores: { [key: string]: string } = {};
    const testScoresRetaking: { [key: string]: string } = {};

    arrTestResults.forEach((result, index) => {
      testScores[`topic${index + 1}`] = result;
    });

    arrTestResultsRetaking.forEach((result, index) => {
      testScoresRetaking[`topic${index + 1}`] = result;
    });

    try {
      const docRef = await addDoc(
        collection(db, "Subjects", "Math", "MyStudents"),
        {
          name,
          testScores,
          testScoresRetaking,
          createdAt: new Date(),
        },
      );
      props.updeteListStudents({
        name,
        testScores,
        testScoresRetaking,
        id: docRef.id,
      });
    } catch (error) {
      console.error("Помилка при збереженні учня:", error);
      alert("Не вдалося зберегти.");
      return;
    }

    props.onSuccess();
  };

  return (
    <div className="student-form-box">
      <div className="student-form-header">
        <h2>Новий учень</h2>
        <p>Введіть ім'я та результати через крапку з комою.</p>
      </div>

      <form className="student-form" onSubmit={handleSubmit}>
        <label className="student-form-field">
          <span>Ім'я учня</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Наприклад: Олена Петренко"
            required
          />
        </label>

        <label className="student-form-field">
          <span>Результати тестів</span>
          <textarea
            value={testResults}
            onChange={(e) => setTestResults(e.target.value)}
            placeholder="Наприклад: 8; 10; 7; 11"
          />
        </label>

        <label className="student-form-field">
          <span>Результати перездачі</span>
          <textarea
            value={testResultsRetaking}
            onChange={(e) => setTestResultsRetaking(e.target.value)}
            placeholder="Наприклад: 10; 11; 9"
          />
        </label>

        <button type="submit" className="student-form-submit">
          Зберегти
        </button>
      </form>
    </div>
  );
};

export default AddNewStudent;
