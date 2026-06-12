import type { Editor } from "@tiptap/react";
import ToolbarButton from "../components/ToolbarButton";

interface Props {
  active: boolean;
  editor: Editor;
}

const H2 = ({ active, editor }: Props) => {
  return (
    <ToolbarButton
      active={active}
      onRun={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      H2
    </ToolbarButton>
  );
};

export default H2;
