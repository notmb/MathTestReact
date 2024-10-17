import { MathJaxContext } from "better-react-mathjax";
import AsideBox from "./components/asideContent/asideBox";

import MainContent from "./components/mainContent/mainContent";

import "./App.css";

function App() {
  return (
    <>
      <div className="app">
        <MathJaxContext>
          <AsideBox />
          <MainContent />
        </MathJaxContext>
      </div>
    </>
  );
}

export default App;
