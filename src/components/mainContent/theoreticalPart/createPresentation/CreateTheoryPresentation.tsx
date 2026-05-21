import type { Editor } from "@tiptap/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../../../firebaseConfig";
import TheoryEditor from "../editor/TheoryEditor";
import "../theoryPartStyle.css";

const initialContent = `
  <h2>Теорія</h2>

  <img src="/MathTestReact/geometry_math.jpg" />

  <p>
    Тут буде математичний контент
  </p>
`;

const CreateTeoryPresentation = () => {
  const [editor, setEditor] = useState<Editor | null>(null);

  const saveTheory = async () => {
    if (!editor) {
      return;
    }

    const json = editor.getJSON();

    await addDoc(
      collection(db, "Subjects", "Math", "Algebra", "Theory", "Topics"),
      {
        title: "Паралелограм",
        content: json,
        createdAt: serverTimestamp(),
      },
    );
    console.log(json);
    console.log("saved");
  };

  return (
    <div className="rounded-xl p-4">
      <TheoryEditor content={initialContent} onEditorReady={setEditor} />
      <button onClick={() => saveTheory()}>Save</button>
    </div>
  );
};

export default CreateTeoryPresentation;
