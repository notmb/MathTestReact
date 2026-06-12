import "../theoryPartStyle.css";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { JSONContent } from "@tiptap/react";
import ViewerPresentation from "./ViewerPresentation";

const YOUR_DOCUMENT_ID = "aGjRlPqIoCicasUBGqVA";

const ViewerPresentationPage = () => {
  const [loadedContent, setLoadedContent] = useState<JSONContent | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTheory = async () => {
      try {
        const theoryRef = doc(
          db,
          "Subjects",
          "Math",
          "Algebra",
          "Theory",
          "Topics",
          YOUR_DOCUMENT_ID,
        );
        const theorySnapshot = await getDoc(theoryRef);
        if (theorySnapshot.exists()) {
          const data = theorySnapshot.data();
          setLoadedContent(data.content);
        } else {
          console.log("Theory document not found");
        }
      } catch (error) {
        console.error("Failed to load theory:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTheory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="theory_editor_page  h-screen bg-blue-100">
      <ViewerPresentation content={loadedContent} />
    </div>
  );
};
export default ViewerPresentationPage;
