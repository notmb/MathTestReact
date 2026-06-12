import type { Editor } from "@tiptap/react";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  editor: Editor;
}

const Undo = ({ editor }: Props) => {
  return (
    <ToolbarButton onRun={() => editor.chain().focus().undo().run()}>
      Undo
    </ToolbarButton>
  );
};

export default Undo;
