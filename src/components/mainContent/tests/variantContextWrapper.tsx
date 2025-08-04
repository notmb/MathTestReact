import { VariantContext } from "./variantContext";
import {
  Tasks,
  Task1,
  Task2,
  Task3,
  VaiantData,
} from "../creatorVariant/types";
import { useImmer } from "use-immer";
import { db } from "../../../firebaseConfig";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useEffect } from "react";

const isTask1 = (task: any): task is Task1 => task.typeOfTask === "choice";
const isTask2 = (task: any): task is Task2 => task.typeOfTask === "comparison";
const isTask3 = (task: any): task is Task3 => task.typeOfTask === "openAnswer";

const VariantContextWrapper = (props: {
  variant: string;
  children: React.ReactNode;
}) => {
  const [tasks, updateTasks] = useImmer<Tasks>({});
  const [dataVariant, updateDataVariant] = useImmer<VaiantData>({
    name: "",
    createdAt: new Timestamp(0, 0),
    numberOfTasks: "",
    variantSerialNumber: "",
  });

  useEffect(() => {
    const fetchVariantData = async () => {
      const docRef = doc(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        "Mix",
        props.variant
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        updateDataVariant(() => docSnap.data() as VaiantData);
      }
    };

    const fetchTasks = async () => {
      const tasksRef = collection(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Topics",
        "Mix",
        props.variant,
        "tasks"
      );
      const snapshot = await getDocs(tasksRef);
      const loaded: Tasks = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (isTask1(data)) loaded[doc.id] = data as Task1;
        else if (isTask2(data)) loaded[doc.id] = data as Task2;
        else if (isTask3(data)) loaded[doc.id] = data as Task3;
      });
      updateTasks(() => loaded);
    };

    fetchVariantData();
    fetchTasks();
  }, [props.variant]);

  return (
    <VariantContext.Provider value={{ tasks, dataVariant }}>
      {props.children}
    </VariantContext.Provider>
  );
};
export default VariantContextWrapper;
