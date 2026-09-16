import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { WrapperForModalWindow } from "../reactTsUtils";
import AddNewStudent from "./formForNewStudent";
import "./studentsProfil.css";

type Student = {
  name: string;
  testScores: {
    [key: string]: string;
  };
  testScoresRetaking: {
    [key: string]: string;
  };
  testScoresNmt?: {
    [key: string]: string;
  };
  id: string;
};

const TEST_COUNT = 21;

const StudentsProfil = () => {
  const [students, updeteStudents] = useImmer<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const NMT_TEST_COUNT = Math.max(
    0,
    ...students.map(
      (student) => Object.keys(student.testScoresNmt ?? {}).length,
    ),
  );

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "Subjects", "Math", "MyStudents"),
        );
        const fetchedStudents: Student[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedStudents.push({
            name: data.name,
            testScores: data.testScores || {},
            testScoresRetaking: data.testScoresRetaking || {},
            testScoresNmt: data.testScoresNmt || {},
            id: doc.id,
          });
        });
        updeteStudents(fetchedStudents);
      } catch (error) {
        console.error("Помилка при завантаженні учнів:", error);
      }
    };

    fetchStudents();
  }, [updeteStudents]);

  return (
    <section className="students-page">
      <div className="students-page-header">
        <div>
          <p className="students-page-kicker">Профілі учнів</p>
          <h1>Результати тестів</h1>
          <p className="students-page-subtitle">
            Таблиця показує першу спробу та перездачу для кожної теми.
          </p>
        </div>

        <button
          className="students-add-button"
          onClick={() => setIsModalOpen(true)}
        >
          Додати учня
        </button>
      </div>
      <div className="students-table-card">
        <div className="students-table-scroll">
          <table className="students-table">
            <thead>
              <tr>
                <th className="students-table-sticky-cell">Учень</th>
                {Array.from({ length: TEST_COUNT }, (_, i) => (
                  <th key={i}>Тест {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td className="students-empty-row" colSpan={TEST_COUNT + 1}>
                    Учнів поки немає. Додайте першого учня, щоб вести
                    результати.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td className="students-table-sticky-cell students-name-cell">
                      {student.name}
                    </td>
                    {Array.from({ length: TEST_COUNT }, (_, i) => (
                      <td key={i} className="students-score-cell">
                        <div className="students-score-primary">
                          {student.testScores?.[`topic${i + 1}`] ?? "-"}
                        </div>
                        <div className="students-score-retake">
                          {student.testScoresRetaking?.[`topic${i + 1}`] ?? "-"}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      // --------------
      <div className="students-table-card">
        <div className="students-table-scroll">
          <table className="students-table">
            <thead>
              <tr>
                <th className="students-table-sticky-cell">Учень</th>
                {Array.from({ length: NMT_TEST_COUNT }, (_, i) => (
                  <th key={i} className="students-score-cell">
                    NMT {i + 1}
                  </th>
                ))}
                {/* + додали порожній останній стовпець */}
                <th className="students-table-filler" />
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    className="students-empty-row"
                    colSpan={NMT_TEST_COUNT + 2}
                  >
                    Учнів поки немає. Додайте першого учня, щоб вести
                    результати.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td className="students-table-sticky-cell students-name-cell">
                      {student.name}
                    </td>
                    {Array.from({ length: NMT_TEST_COUNT }, (_, i) => (
                      <td key={i} className="students-score-cell">
                        <div className="students-score-primary">
                          {student.testScores?.[`topic${i + 1}`] ?? "-"}
                        </div>
                        <div className="students-score-retake">
                          {student.testScoresRetaking?.[`topic${i + 1}`] ?? "-"}
                        </div>
                      </td>
                    ))}
                    {/* + filler */}
                    <td className="students-table-filler" />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      // -----------------
      {isModalOpen && (
        <WrapperForModalWindow onClose={() => setIsModalOpen(false)}>
          <AddNewStudent
            onSuccess={() => setIsModalOpen(false)}
            updeteListStudents={(data) => {
              updeteStudents((draft) => {
                draft.push(data);
              });
            }}
          ></AddNewStudent>
        </WrapperForModalWindow>
      )}
    </section>
  );
};

export default StudentsProfil;
