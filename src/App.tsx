import { MathJaxContext } from "better-react-mathjax";
import { useEffect, useState } from "react";
import AsideBox from "./components/asideContent/asideBox";
import Router from "./route";

import "./App.css";

function App() {
  const [currentPath, setcurrentPath] = useState<string>(
    window.location.pathname
  );

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setcurrentPath(path);
  };
  useEffect(() => {
    const onLocationChange = () => {
      setcurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", onLocationChange);
    return () => {
      removeEventListener("popstate", onLocationChange);
    };
  }, []);

  return (
    <>
      <div className="app">
        <MathJaxContext>
          <AsideBox navigate={navigate} />
          <Router currentPath={currentPath} />
        </MathJaxContext>
      </div>
    </>
  );
}

export default App;
