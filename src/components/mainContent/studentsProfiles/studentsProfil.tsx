import { useImmer } from "use-immer";
import { useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
type Student = {
  name: string;
  testScores: {
    [key: string]: string; // індексований тип
  };
  id: string;
};

const StudentsProfil = () => {
  const [students, updeteStudents] = useImmer<Student[]>([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "Subjects", "Math", "MyStudents")
        );
        const fetchedStudents: Student[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedStudents.push({
            name: data.name,
            testScores: data.testScores || {},
            id: doc.id,
          });
        });
        console.log(fetchedStudents);
        updeteStudents(fetchedStudents);
      } catch (error) {
        console.error("Помилка при завантаженні студентів:", error);
      }
    };

    fetchStudents();
  }, []);
  //   const students: Student[] = [
  //     {
  //       name: "Філонюк Андріана",
  //       testScores: {
  //         test_01: "40/200",
  //         test_02: "40/200",
  //       },
  //     },
  //     {
  //       name: "Мальцева Марія",
  //       testScores: {
  //         test_01: "40/200",
  //         test_02: "40/200",
  //       },
  //     },
  //   ];
  return (
    <div className="conteiner_for_students_profil">
      <div className="overflow-x-auto max-w-full">
        <table className="table-auto border-collapse min-w-max">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white border px-4 py-2">
                Учень
              </th>
              {Array.from({ length: 21 }, (_, i) => (
                <th key={i} className="border px-2 py-2">
                  Тест {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="sticky left-0 z-10 bg-white border px-4 py-2 font-medium whitespace-nowrap">
                  {student.name}
                </td>
                {Array.from({ length: 21 }, (_, i) => (
                  <td key={i} className="border px-2 py-2 text-center">
                    {student.testScores?.[`topic${i + 1}`] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StudentsProfil;
