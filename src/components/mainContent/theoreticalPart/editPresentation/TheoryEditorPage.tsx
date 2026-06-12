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
import TheoryEditor from "../editor/TheoryEditor";

import type { Editor, JSONContent } from "@tiptap/react";

const YOUR_DOCUMENT_ID = "aGjRlPqIoCicasUBGqVA";
const THEORY_IMAGE_UPLOAD_FOLDER = `theory/topics/${YOUR_DOCUMENT_ID}/images`;

const isSameContent = (
  currentContent: JSONContent | null,
  savedContent: JSONContent | null,
) => JSON.stringify(currentContent) === JSON.stringify(savedContent);

const TheoryEditorPage = () => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [loadedContent, setLoadedContent] = useState<JSONContent | null>(null);
  //loadedContent - контент із firebase
  const [initialEditorContent, setInitialEditorContent] =
    useState<JSONContent | null>(null);
  //initialEditorContent - версія документа, яку ми вважаємо вже збереженою.
  const [loading, setLoading] = useState<boolean>(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    //loadTheory - функція, яка завантажує документ теорії з Firebase Firestore.
    const loadTheory = async () => {
      try {
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
        } else {
          console.log("Theory document not found");
        }
      } catch (error) {
        console.error("Failed to load theory:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTheory();
  }, []);

  const handleEditorReady = (readyEditor: Editor) => {
    setEditor(readyEditor);
    setInitialEditorContent(readyEditor.getJSON());
  };

  const saveTheory = async () => {
    if (!editor) {
      return;
    }

    const currentContent = editor.getJSON();

    if (isSameContent(currentContent, initialEditorContent)) {
      setSaveMessage("Змін немає");
      return;
    }

    setSaveMessage(null);

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
            content: currentContent,
            updatedAt: serverTimestamp(),
          },
        );
        console.log("Оновлено!");
        setInitialEditorContent(currentContent);
        setSaveMessage("Зміни збережено");
      } catch (error) {
        console.log(error);
        setSaveMessage("Не вдалося зберегти зміни");
      }
    } else {
      try {
        await addDoc(
          collection(db, "Subjects", "Math", "Algebra", "Theory", "Topics"),
          {
            title: "Паралелограм",
            content: currentContent,
            createdAt: serverTimestamp(),
          },
        );
        console.log("Створено!");
        setInitialEditorContent(currentContent);
        setSaveMessage("Презентацію створено");
      } catch (error) {
        console.log(error);
        setSaveMessage("Не вдалося створити презентацію");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="theory_editor_page  h-screen bg-blue-100">
      <TheoryEditor
        content={loadedContent}
        imageUploadFolder={THEORY_IMAGE_UPLOAD_FOLDER}
        onEditorReady={handleEditorReady}
      />
      <button
        className="theory_save_button"
        onClick={() => {
          saveTheory();
        }}
      >
        Оновити презентацію
      </button>
      {saveMessage && <p className="theory_save_message">{saveMessage}</p>}
    </div>
  );
};

export default TheoryEditorPage;
