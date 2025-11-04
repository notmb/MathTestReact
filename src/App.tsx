import { BrowserRouter } from "react-router-dom";
import { MathJaxContext } from "better-react-mathjax";
import AppRouter from "./AppRouter";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <MathJaxContext>
        <BrowserRouter basename="/MathTestReact">
          <div className="app">
            <Header />
            <AppRouter />
            <Footer />
          </div>
        </BrowserRouter>
      </MathJaxContext>
    </div>
  );
}

export default App;
