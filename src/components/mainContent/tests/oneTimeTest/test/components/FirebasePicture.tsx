import { useEffect, useState } from "react";
import { app } from "../../../../../../firebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const fetchImage = async (url: string) => {
  const storage = getStorage(app);
  const storageRef = ref(storage, url);
  return getDownloadURL(storageRef);
};

const FirebasePicture = (props: {
  url: string;
  className: string;
  alt?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchImage(props.url).then((newUrl) => {
      if (isMounted) setImageUrl(newUrl);
    });

    return () => {
      isMounted = false;
    };
  }, [props.url]);

  return (
    <div className="container-for-picture">
      {imageUrl ? (
        <img
          className={props.className}
          src={imageUrl}
          alt={props.alt ?? "Loaded from Firebase"}
        />
      ) : (
        <p>Завантаження зображення...</p>
      )}
    </div>
  );
};

export default FirebasePicture;


