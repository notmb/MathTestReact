import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor;
}

const TheoryToolbar = (props: Props) => {
  const { editor } = props;

  return (
    <div className="theory_toolbar">
      <button
        className={
          editor.isActive("bold") ? "toolbar_button active" : "toolbar_button"
        }
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>

      <button
        className={
          editor.isActive("italic") ? "toolbar_button active" : "toolbar_button"
        }
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </button>

      <button
        className={
          editor.isActive("heading", { level: 1 })
            ? "toolbar_button active"
            : "toolbar_button"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </button>

      <button
        className={
          editor.isActive("heading", { level: 2 })
            ? "toolbar_button active"
            : "toolbar_button"
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </button>

      <button
        className={
          editor.isActive("bulletList")
            ? "toolbar_button active"
            : "toolbar_button"
        }
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </button>

      <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>

      <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
    </div>
  );
};

export default TheoryToolbar;
