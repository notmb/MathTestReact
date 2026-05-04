import "./header.css";

import { useState } from "react";
import logo from "/logo.svg";

const Header = (props: { navigate: (path: string) => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    props.navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="box_header">
      <header className="header">
        <img
          className="logo"
          src={logo}
          alt="MathTest"
          onClick={() => handleNavigate("/MathTestReact/main")}
        ></img>

        <div className="header_navigation">
          <div
            className="header_navigation_item"
            onClick={() => handleNavigate("/MathTestReact/allTest")}
          >
            <h5 className="header_navigation_item_h">Переглянути тести</h5>
          </div>
          <div
            className="header_navigation_item"
            onClick={() => handleNavigate("/MathTestReact/study")}
          >
            <h5 className="header_navigation_item_h">Додати тест</h5>
          </div>
          <div
            className="header_navigation_item"
            onClick={() => handleNavigate("/MathTestReact/student")}
          >
            <h5 className="header_navigation_item_h">Учні</h5>
          </div>
        </div>

        <div
          className="header_log_in"
          onClick={() => handleNavigate("/MathTestReact/account/login")}
        >
          <h4 className="header_navigation_item_h">Log in</h4>
        </div>

        <button
          className={`burger_button ${
            isMobileMenuOpen ? "burger_button_open" : ""
          }`}
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <nav
        className={`mobile_header_navigation ${
          isMobileMenuOpen ? "mobile_header_navigation_open" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => handleNavigate("/MathTestReact/allTest")}
        >
          Переглянути тести
        </button>
        <button
          type="button"
          onClick={() => handleNavigate("/MathTestReact/study")}
        >
          Додати тест
        </button>
        <button
          type="button"
          onClick={() => handleNavigate("/MathTestReact/student")}
        >
          Учні
        </button>
        <button
          type="button"
          onClick={() => handleNavigate("/MathTestReact/account/login")}
        >
          Log in
        </button>
      </nav>
    </div>
  );
};

export default Header;
