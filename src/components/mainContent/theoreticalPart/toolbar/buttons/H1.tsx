import type { Editor } from "@tiptap/react";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  active: boolean;
  editor: Editor;
}

const H1 = ({ active, editor }: Props) => {
  return (
    <ToolbarButton
      active={active}
      onRun={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    >
      H1
    </ToolbarButton>
  );
};

export default H1;
