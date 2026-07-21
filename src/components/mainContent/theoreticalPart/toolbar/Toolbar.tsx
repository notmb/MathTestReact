import { Editor, useEditorState } from "@tiptap/react";
import Bold from "./buttons/Bold";
import BulletList from "./buttons/BulletList";
import H1 from "./buttons/H1";
import H2 from "./buttons/H2";
import ImageButton from "./buttons/ImageButton";
import InlineMathButton from "./buttons/InlineMathButton";
import Italic from "./buttons/Italic";
import MathBlockButton from "./buttons/MathBlockButton";
import Redo from "./buttons/Redo";
import Undo from "./buttons/Undo";
import "../theoryPartStyle.css";

interface Props {
  editor: Editor;
  imageUploadFolder?: string;
}

const TheoryToolbar = (props: Props) => {
  const { editor, imageUploadFolder = "theory/images" } = props;
  const activeState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      heading1: editor.isActive("heading", { level: 1 }),
      heading2: editor.isActive("heading", { level: 2 }),
      bulletList: editor.isActive("bulletList"),
    }),
  });

  return (
    <div className="theory_toolbar">
      <Bold editor={editor} active={activeState.bold} />
      <Italic editor={editor} active={activeState.italic} />
      <H1 editor={editor} active={activeState.heading1} />
      <H2 editor={editor} active={activeState.heading2} />
      <InlineMathButton editor={editor} />
      <MathBlockButton editor={editor} />
      <BulletList editor={editor} active={activeState.bulletList} />
      <ImageButton
        editor={editor}
        imageUploadFolder={imageUploadFolder}
      />
      <Undo editor={editor} />
      <Redo editor={editor} />
    </div>
  );
};

export default TheoryToolbar;
