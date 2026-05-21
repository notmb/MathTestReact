import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor, JSONContent } from "@tiptap/react";
import { useEffect } from "react";
import TheoryToolbar from "../toolbar/Toolbar";
import "../theoryPartStyle.css";
import { theoryEditorExtensions } from "./theoryEditorExtensions";

interface Props {
  content: JSONContent | string | null;
  editable?: boolean;
  showToolbar?: boolean;
  onChange?: (content: JSONContent) => void;
  onEditorReady?: (editor: Editor) => void;
}

const TheoryEditor = ({
  content,
  editable = true,
  showToolbar = true,
  onChange,
  onEditorReady,
}: Props) => {
  const editor = useEditor({
    extensions: theoryEditorExtensions,
    content: content ?? "",
    editable,
    onUpdate({ editor }) {
      onChange?.(editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(editable);
  }, [editable, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  if (!editor) {
    return null;
  }

  return (
    <div className="creator_theory">
      {showToolbar && editable && <TheoryToolbar editor={editor} />}
      <EditorContent editor={editor} className="theory_editor_wrapper" />
    </div>
  );
};

export default TheoryEditor;
