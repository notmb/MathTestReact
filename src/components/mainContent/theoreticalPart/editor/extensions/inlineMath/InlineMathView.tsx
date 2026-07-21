import { MathJax } from "better-react-mathjax";
import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

const InlineMathView = ({
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
      as="span"
      className={selected ? "inline_math selected" : "inline_math"}
      data-type="inline-math"
      onDoubleClick={editFormula}
    >
      <MathJax dynamic>{`\\(${latex}\\)`}</MathJax>
    </NodeViewWrapper>
  );
};

export default InlineMathView;
