import { MathJaxContext } from "better-react-mathjax";
import Router from "./router";
import { useState, useEffect } from "react";

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
          <Router currentPath={currentPath} navigate={navigate} />
        </MathJaxContext>
      </div>
    </>
  );
}

export default App;
