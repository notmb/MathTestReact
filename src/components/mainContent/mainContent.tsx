import "./mainContent.css";
import Tests from "./tests";
import { useState, useEffect } from "react";
import Router2 from "./route2";
const MainContent = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // Функція для зміни стану
  const handleClick = () => {
    setIsClicked(false);
    navigate("/test/newtest");
  };

  const [currentPath, setcurrentPath] = useState<string>(
    window.location.pathname
  );

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setIsClicked(true);
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
    <main className="main-content">
      <button onClick={handleClick}>створити тест</button>
      {isClicked && <Router2 currentPath={currentPath} />}
    </main>
  );
};
export default MainContent;
