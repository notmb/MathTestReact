import type { Editor } from "@tiptap/react";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  editor: Editor;
}

const Redo = ({ editor }: Props) => {
  return (
    <ToolbarButton onRun={() => editor.chain().focus().redo().run()}>
      Redo
    </ToolbarButton>
  );
};

export default Redo;
