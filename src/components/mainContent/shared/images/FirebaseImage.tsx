import { useEffect, useState } from "react";
import { getImageUrl } from "./firebaseImageStorage";

type FirebaseImageProps = {
  path?: string;
  src?: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
  loadingClassName?: string;
  errorClassName?: string;
  loadingText?: string;
  errorText?: string;
};

const FirebaseImage = ({
  path,
  src,
  alt = "Image",
  className,
  wrapperClassName,
  loadingClassName,
  errorClassName,
  loadingText = "Loading image...",
  errorText = "Failed to load image.",
}: FirebaseImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(src ?? null);
  const [isLoading, setIsLoading] = useState(Boolean(path && !src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    if (src) {
      setImageUrl(src);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    if (!path) {
      setImageUrl(null);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setImageUrl(null);
    setIsLoading(true);
    setHasError(false);

    getImageUrl(path)
      .then((downloadUrl) => {
        if (!isActive) {
          return;
        }

        setImageUrl(downloadUrl);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setHasError(true);
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [path, src]);

  if (!path && !src) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      {imageUrl && <img className={className} src={imageUrl} alt={alt} />}
      {isLoading && <p className={loadingClassName}>{loadingText}</p>}
      {hasError && <p className={errorClassName}>{errorText}</p>}
    </div>
  );
};

export default FirebaseImage;
