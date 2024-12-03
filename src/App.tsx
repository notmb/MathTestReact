import { MathJaxContext } from "better-react-mathjax";
import Router from "./route";
import Header from "./components/header/header";
import { useState, useEffect } from "react";
import Footer from "./components/footer/footer";

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
          <Header navigate={navigate} />
          <Router currentPath={currentPath} navigate={navigate} />
          <Footer />
        </MathJaxContext>
      </div>
    </>
  );
}

export default App;
