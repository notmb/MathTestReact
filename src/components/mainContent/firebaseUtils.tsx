import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

//функція пошуку ID документу у колекції collectionPath: string, за полем fieldName: string та його значенням  value: string
export const findDocIdByField = async (
  collectionPath: string,
  fieldName: string,
  value: string
): Promise<string | null> => {
  try {
    // Прибираємо провідний слеш, якщо є, і розбиваємо шлях на сегменти
    const pathSegments = collectionPath.replace(/^\/+/, "").split("/") as [
      string,
      ...string[]
    ];
    // Отримаємо колекцію за сегментами
    if (pathSegments.length % 2 === 1) {
      // непарна кількість — це колекція
      const colRef = collection(db, ...pathSegments);
      //формуємо запит
      const q = query(colRef, where(fieldName, "==", value));
      // Виконуємо запит
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      } else {
        return null;
      }
    } else {
      console.warn("Вказаний шлях веде до документа, а не до колекції.");
      return null;
    }
  } catch (error) {
    console.error("Помилка пошуку документа:", error);
    return null;
  }
};
