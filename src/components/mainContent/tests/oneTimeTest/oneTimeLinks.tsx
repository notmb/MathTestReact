import TestResults from "../testResults";
import CreatorNewLinkForStudent from "./creatorNewLinkForSt";
import { useEffect, useState } from "react";
// import { useVariantContext } from "../variantContext";
import { WrapperForModalWindow } from "../../reactTsUtils";
import { useImmer } from "use-immer";
import {
  collection,
  // setDoc,
  // updateDoc,
  query,
  where,
  getDocs,
  // addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
// import { findDocIdByField } from "../../firebaseUtils";

interface TestLink {
  id: string; // id лінку
  variantId: string; // id варіанту
  used: boolean;
  nameStudent: string;
  testResult: string;
  // інші поля, які є в документі
}
interface SelectedLink {
  selectedLink: string;
  nameStudent: string;
}

const OneTimeLinks = (props: { selectedVariant: string }) => {
  const [testLinks, updateTestLinks] = useImmer<TestLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOFAddingLinkOpen, setIsModalOFAddingLinkOpen] = useState(false);

  const [selectedAnswersData, updateSelectedAnswersData] =
    useImmer<SelectedLink | null>(null);

  // const { dataVariant } = useVariantContext();

  const fetchTestLinks = async () => {
    const testLinksRef = collection(db, "Subjects", "Math", "TestLinks");
    const dataLinks = query(
      testLinksRef,
      where("variantId", "==", props.selectedVariant)
    );
    try {
      const querySnapshot = await getDocs(dataLinks);

      const links: TestLink[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TestLink[];
      updateTestLinks(links);
    } catch (error) {
      console.error("Помилка при отриманні документів:", error);
    }
  };

  useEffect(() => {
    fetchTestLinks();
  }, []);

  // const addLink = async () => {
  //   const newLink = collection(db, "Subjects", "Math", "TestLinks");

  //   //вказуємо ім'я студента для якого створюємо лінку
  //   const userName = prompt("Введіть ім'я учня:")?.trim() || "Не Вказано";
  //   if (!userName) {
  //     console.warn("Ім'я учня не введено");
  //     return;
  //   }

  //   try {
  //     // Знаходимо id учня
  //     const studentId = await findDocIdByField(
  //       "/Subjects/Math/MyStudents",
  //       "name",
  //       userName
  //     );
  //     if (!studentId) {
  //       console.warn("Учня не знайдено в базі MyStudents");
  //       return;
  //     }

  //     console.log(studentId);
  //     //в профілі учня оновлюємо поле testScores.topicN: "не почато"
  //     const docRefStudent = doc(
  //       db,
  //       "Subjects",
  //       "Math",
  //       "MyStudents",
  //       studentId
  //     );
  //     await updateDoc(docRefStudent, {
  //       [`testScores.${dataVariant.variantSerialNumber}`]: "не почато", // динамічний ключ
  //     });
  //     console.log("Поле оновлено");

  //     //в профілі учня створюємо або редагуємо колекцію ResultsTest - детальні результати тесту
  //     const resultTestDocRef = doc(
  //       collection(docRefStudent, "ResultsTest"),
  //       props.selectedVariant // ID документа буде співпадати з ID варіанта тесту
  //     );
  //     await setDoc(resultTestDocRef, {
  //       userAnswers: {}, // Поки що порожній об'єкт
  //       result: "не пройдено", // Початковий статус
  //       pointsForTasks: {}, // Порожній об'єкт, бо ще не пройдено
  //       variantId: props.selectedVariant,
  //       variantName: dataVariant.variantSerialNumber, // Або будь-яка інша назва
  //     });
  //     console.log("Документ ResultsTest створено/оновлено");

  //     //додаємо новий лінк в TestLinks
  //     const docRef = await addDoc(newLink, {
  //       variantId: props.selectedVariant,
  //       createdAt: new Date(),
  //       used: false,
  //       nameStudent: userName,
  //       testResult: "не пройдено",
  //     });

  //     updateTestLinks((draft) => {
  //       draft.push({
  //         id: docRef.id,
  //         variantId: props.selectedVariant,
  //         used: false,
  //         nameStudent: userName,
  //         testResult: "не пройдено",
  //       });
  //     });
  //     console.log("Користувача додано");
  //   } catch (error) {
  //     console.error("Помилка створення:", error);
  //   }
  // };

  const host = window.location.host;
  const getLink = (idLink: string) => {
    alert(
      `твій лінк на тест - http://${host}/MathTestReact/${idLink}/one-time-test`
    );
  };

  const removeLink = async (link: string, index: number) => {
    await deleteDoc(doc(db, "Subjects", "Math", "TestLinks", link));
    updateTestLinks((draft) => {
      draft.splice(index, 1); // ✅ абсолютно нормально — Immer сам зробить копію
    });
  };

  const ViewTheResults = (selectedLink: string, nameStudent: string) => {
    setIsModalOpen(true);
    updateSelectedAnswersData(() => ({
      selectedLink: selectedLink,
      nameStudent: nameStudent,
    }));
  };

  return (
    <div className="one-time-links">
      <button onClick={() => setIsModalOFAddingLinkOpen(true)}>
        Cтворити Link
      </button>
      <p>ONE TIME LINKS:</p>
      {testLinks.length > 0 &&
        testLinks.map((item, index) => {
          return (
            <div className="border border-black" key={item.id}>
              <span onClick={() => getLink(item.id)}>
                <p>{item.id}</p>
                <p>Учень: {item.nameStudent}</p>
                <p>
                  {item.used === false
                    ? "не пройдено"
                    : `пройдено, результат: ${item.testResult}`}
                </p>
              </span>
              <button
                onClick={() => removeLink(item.id, index)}
                className="m-2"
              >
                Видалити Link
              </button>
              {item.used === true && (
                <button
                  className="m-2"
                  onClick={() => ViewTheResults(item.id, item.nameStudent)}
                >
                  Переглянутити результати
                </button>
              )}
            </div>
          );
        })}
      {isModalOpen && selectedAnswersData && (
        <TestResults
          onClose={() => setIsModalOpen(false)}
          variantId={props.selectedVariant}
          nameStudent={selectedAnswersData.nameStudent}
          selectedLink={selectedAnswersData.selectedLink}
        />
      )}
      {isModalOFAddingLinkOpen && (
        <WrapperForModalWindow
          onClose={() => setIsModalOFAddingLinkOpen(false)}
        >
          <CreatorNewLinkForStudent
            selectedVariant={props.selectedVariant}
            onClose={() => setIsModalOFAddingLinkOpen(false)}
            updateTestLinks={(dataLink) => {
              updateTestLinks((draft) => {
                draft.push(dataLink);
              });
            }}
          />
        </WrapperForModalWindow>
      )}
    </div>
  );
};
export default OneTimeLinks;
