import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../../../../firebaseConfig";

const fetchImage = async (url: string) => {
  const storage = getStorage(app);
  const storageRef = ref(storage, url);

  return getDownloadURL(storageRef);
};

const FirebaseImage = (props: {
  url: string;
  className: string;
  wrapperClassName: string;
  loadingClassName: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    setImageUrl(null);
    setHasError(false);

    fetchImage(props.url)
      .then((newUrl) => {
        if (isActive) {
          setImageUrl(newUrl);
        }
      })
      .catch(() => {
        if (isActive) {
          setHasError(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [props.url]);

  return (
    <div className={props.wrapperClassName}>
      {imageUrl ? (
        <img className={props.className} src={imageUrl} alt="Loaded from Firebase" />
      ) : hasError ? (
        <p className={props.loadingClassName}>Не вдалося завантажити зображення.</p>
      ) : (
        <p className={props.loadingClassName}>Завантаження зображення...</p>
      )}
    </div>
  );
};

export default FirebaseImage;
