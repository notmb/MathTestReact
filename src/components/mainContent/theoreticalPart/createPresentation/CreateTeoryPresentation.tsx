import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import "../theoryPartStyle.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import TheoryToolbar from "../toolbar/Toolbar";

const CreateTeoryPresentation = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "my-image",
        },
      }),
    ],

    content: `
            <h2>Теорія</h2>

            <img src="/MathTestReact/geometry_math.jpg" />

            <p>
                Тут буде математичний контент
            </p>
        `,
  });
  if (!editor) {
    return null;
  }
  const saveTheory = async () => {
    console.log(editor.getJSON());
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
    <div className="border border-black rounded-xl p-4">
      <div className="flex gap-2 mb-4">
        <TheoryToolbar editor={editor}></TheoryToolbar>

        <EditorContent editor={editor} className="min-h-[300px]" />
      </div>
      <button onClick={() => saveTheory()}>Save</button>
    </div>
  );
};
export default CreateTeoryPresentation;
