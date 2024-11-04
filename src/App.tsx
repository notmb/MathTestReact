import { MathJaxContext } from "better-react-mathjax";
import MainPage from "./components/mainPage";
import Header from "./components/header/header";

import "./App.css";

function App() {
  return (
    <>
      <div className="app">
        <MathJaxContext>
          <Header />
          <MainPage />
        </MathJaxContext>
      </div>
    </>
  );
}

export default App;
