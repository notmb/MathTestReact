import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import InlineMathView from "./InlineMathView";

const InlineMath = Node.create({
  name: "inlineMath",

  group: "inline",

  inline: true,

  atom: true,

  selectable: true,

  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-latex") ?? "",
        renderHTML: (attributes) => ({
          "data-latex": attributes.latex,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="inline-math"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": "inline-math",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineMathView);
  },
});

export default InlineMath;
