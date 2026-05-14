import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import "../theoryPartStyle.css";
import TheoryEditor from "./TheoryEditor";

import { JSONContent } from "@tiptap/react";

const YOUR_DOCUMENT_ID = "aGjRlPqIoCicasUBGqVA";

const TheoryEditorPage = () => {
  const [loadedContent, setLoadedContent] = useState<JSONContent | null>(null);
  const [contentToSave, setContentToSave] = useState<JSONContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTeory = async () => {
      const theoryRef = doc(
        db,
        "Subjects",
        "Math",
        "Algebra",
        "Theory",
        "Topics",
        YOUR_DOCUMENT_ID,
      );
      const theorySnapshot = await getDoc(theoryRef);
      if (theorySnapshot.exists()) {
        const data = theorySnapshot.data();
        setLoadedContent(data.content);
      }
      setLoading(false);
    };
    loadTeory();
  }, []);

  const saveTheory = async () => {
    if (!contentToSave) {
      return;
    }

    if (YOUR_DOCUMENT_ID) {
      try {
        await updateDoc(
          doc(
            db,
            "Subjects",
            "Math",
            "Algebra",
            "Theory",
            "Topics",
            YOUR_DOCUMENT_ID,
          ),
          {
            content: contentToSave,
            updatedAt: serverTimestamp(),
          },
        );
        console.log("Оновлено!");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await addDoc(
          collection(db, "Subjects", "Math", "Algebra", "Theory", "Topics"),
          {
            title: "Паралелограм",
            content: contentToSave,
            createdAt: serverTimestamp(),
          },
        );
        console.log("Створено!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="theory_editor_page  h-screen bg-blue-100">
      <TheoryEditor content={loadedContent} onChange={setContentToSave} />
      <button
        onClick={() => {
          saveTheory();
        }}
      >
        Оновити презентацію
      </button>
    </div>
  );
};

export default TheoryEditorPage;
