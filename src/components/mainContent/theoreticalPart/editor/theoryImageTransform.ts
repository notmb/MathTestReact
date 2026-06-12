import type { JSONContent } from "@tiptap/react";
import type { PendingTheoryImages } from "../type";

export const findPendingImagesInContent = (
  content: JSONContent,
  pendingImages: PendingTheoryImages,
): PendingTheoryImages => {
  const imagesToUpload: PendingTheoryImages = {};

  const visit = (node: JSONContent) => {
    const src = node.attrs?.src;

    if (
      node.type === "image" &&
      typeof src === "string" &&
      src.startsWith("data:image/") &&
      pendingImages[src]
    ) {
      imagesToUpload[src] = pendingImages[src];
    }

    node.content?.forEach(visit);
  };
  visit(content);
  return imagesToUpload;
};
