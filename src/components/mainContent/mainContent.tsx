import "./mainContent.css";
import Tests from "./tests";
import { useState } from "react";
const MainContent = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // Функція для зміни стану
  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <main className="main-content">
      <button onClick={handleClick}>створити тест</button>
      {isClicked && <Tests />}
    </main>
  );
};
export default MainContent;
