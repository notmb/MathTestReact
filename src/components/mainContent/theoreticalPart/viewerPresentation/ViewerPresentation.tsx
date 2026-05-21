import type { JSONContent } from "@tiptap/react";
import TheoryEditor from "../editor/TheoryEditor";

interface Props {
  content: JSONContent | null;
}

const ViewerPresentation = (props: Props) => {
  return (
    <TheoryEditor
      content={props.content}
      editable={false}
      showToolbar={false}
    />
  );
};

export default ViewerPresentation;
