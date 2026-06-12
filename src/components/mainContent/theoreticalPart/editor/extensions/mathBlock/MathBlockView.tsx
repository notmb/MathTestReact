import { MathJax } from "better-react-mathjax";
import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

const MathBlockView = ({
  node,
  selected,
  updateAttributes,
}: NodeViewProps) => {
  const latex = node.attrs.latex as string;

  const editFormula = () => {
    const nextLatex = prompt("LaTeX", latex);

    if (nextLatex === null) {
      return;
    }

    updateAttributes({
      latex: nextLatex,
    });
  };

  return (
    <NodeViewWrapper
      className={selected ? "math_block selected" : "math_block"}
      data-type="math-block"
    >
      <span
        className="math_block_drag_handle"
        contentEditable={false}
        data-drag-handle
        title="Drag formula"
      >
        ::
      </span>
      <div className="math_block_formula" onDoubleClick={editFormula}>
        <MathJax dynamic>{`\\[${latex}\\]`}</MathJax>
      </div>
    </NodeViewWrapper>
  );
};

export default MathBlockView;
