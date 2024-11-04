import "./mainPage.css";
import AsideBox from "./asideContent/asideBox";
import Router from "../route";
import { useState, useEffect } from "react";

const MainPage = () => {
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
    <div className="main_page">
      <AsideBox navigate={navigate} />
      <Router currentPath={currentPath} />
    </div>
  );
};
export default MainPage;
