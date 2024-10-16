import { MathJaxContext } from "better-react-mathjax";

import MainContent from "./components/mainContent/mainContent";

import "./App.css";

function App() {
  return (
    <>
      <div className="app">
        <MathJaxContext>
          <MainContent />
        </MathJaxContext>
      </div>
    </>
  );
}

export default App;
