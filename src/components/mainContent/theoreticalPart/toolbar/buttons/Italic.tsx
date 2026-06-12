import type { Editor } from "@tiptap/react";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  active: boolean;
  editor: Editor;
}

const Italic = ({ active, editor }: Props) => {
  return (
    <ToolbarButton
      active={active}
      onRun={() => editor.chain().focus().toggleItalic().run()}
    >
      I
    </ToolbarButton>
  );
};

export default Italic;
