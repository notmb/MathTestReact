import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";
import { storage } from "../../../../firebaseConfig";

export type UploadImageOptions = {
  folder: string;
  fileName?: string;
  metadata?: UploadMetadata;
};

export type UploadedImage = {
  path: string;
  downloadUrl: string;
  fileName: string;
};

const normalizeFolder = (folder: string) =>
  folder
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

const getFileExtension = (fileName: string) => {
  const extension = fileName.split(".").pop();
  return extension && extension !== fileName ? extension.toLowerCase() : "jpg";
};

const createSafeFileName = (file: File) => {
  const extension = getFileExtension(file.name);
  const baseName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const safeBaseName = baseName || "image";

  return `${safeBaseName}-${Date.now()}.${extension}`;
};

export const createImagePath = (
  folder: string,
  file: File,
  fileName = createSafeFileName(file),
) => {
  const normalizedFolder = normalizeFolder(folder);

  return normalizedFolder ? `${normalizedFolder}/${fileName}` : fileName;
};

export const getImageUrl = async (path: string): Promise<string> => {
  return getDownloadURL(ref(storage, path));
};

export const uploadImage = async (
  file: File,
  options: UploadImageOptions,
): Promise<UploadedImage> => {
  const fileName = options.fileName ?? createSafeFileName(file);
  const path = createImagePath(options.folder, file, fileName);
  const imageRef = ref(storage, path);

  await uploadBytes(imageRef, file, options.metadata);

  return {
    path,
    downloadUrl: await getDownloadURL(imageRef),
    fileName,
  };
};

export const deleteImage = async (path: string): Promise<void> => {
  await deleteObject(ref(storage, path));
};
