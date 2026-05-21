import { Editor, useEditorState } from "@tiptap/react";
import type { MouseEvent } from "react";
import "../theoryPartStyle.css";

interface Props {
  editor: Editor;
}

const TheoryToolbar = (props: Props) => {
  const { editor } = props;
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

  const runCommand = (event: MouseEvent, command: () => void) => {
    event.preventDefault();
    command();
  };

  return (
    <div className="theory_toolbar">
      <button
        type="button"
        className={
          activeState.bold ? "toolbar_button active" : "toolbar_button"
        }
        onMouseDown={(event) =>
          runCommand(event, () => editor.chain().focus().toggleBold().run())
        }
      >
        B
      </button>

      <button
        type="button"
        className={
          activeState.italic ? "toolbar_button active" : "toolbar_button"
        }
        onMouseDown={(event) =>
          runCommand(event, () => editor.chain().focus().toggleItalic().run())
        }
      >
        I
      </button>

      <button
        type="button"
        className={
          activeState.heading1 ? "toolbar_button active" : "toolbar_button"
        }
        onMouseDown={(event) =>
          runCommand(event, () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          )
        }
      >
        H1
      </button>

      <button
        type="button"
        className={
          activeState.heading2 ? "toolbar_button active" : "toolbar_button"
        }
        onMouseDown={(event) =>
          runCommand(event, () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          )
        }
      >
        H2
      </button>

      <button
        type="button"
        className={
          activeState.bulletList ? "toolbar_button active" : "toolbar_button"
        }
        onMouseDown={(event) =>
          runCommand(event, () =>
            editor.chain().focus().toggleBulletList().run(),
          )
        }
      >
        • List
      </button>

      <button
        type="button"
        onMouseDown={(event) =>
          runCommand(event, () => editor.chain().focus().undo().run())
        }
      >
        Undo
      </button>

      <button
        type="button"
        onMouseDown={(event) =>
          runCommand(event, () => editor.chain().focus().redo().run())
        }
      >
        Redo
      </button>
    </div>
  );
};

export default TheoryToolbar;
