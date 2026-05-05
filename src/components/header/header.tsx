import "./header.css";
import { useState } from "react";
import logo from "/logo.svg";

const Header = (props: { navigate: (path: string) => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = window.location.pathname;
  const isMainPage =
    pathname === "/MathTestReact/" || pathname === "/MathTestReact/main";
  console.log(pathname, isMainPage);
  const handleNavigate = (path: string) => {
    props.navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={isMainPage ? "header_big" : "header_small"}>
      <div className="section_top">
        <img
          className="logo"
          src={logo}
          alt="MathTest"
          onClick={() => handleNavigate("/MathTestReact/main")}
        ></img>

        <div
          className={
            isMainPage ? "section_navigation_none" : "section_navigation"
          }
        >
          <div
            className="navigation_item_header_small"
            onClick={() => handleNavigate("/MathTestReact/allTest")}
          >
            <h5>Переглянути тести</h5>
          </div>
          <div
            className="navigation_item_header_small"
            onClick={() => handleNavigate("/MathTestReact/study")}
          >
            <h5>Додати тест</h5>
          </div>
          <div
            className="navigation_item_header_small"
            onClick={() => handleNavigate("/MathTestReact/student")}
          >
            <h5>Учні</h5>
          </div>
        </div>

        <button
          className="auth_button"
          type="button"
          onClick={() => handleNavigate("/MathTestReact/account/login")}
        >
          Log in
        </button>

        <button
          className={`burger_button ${
            isMobileMenuOpen ? "burger_button_open" : ""
          }`}
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-header-navigation"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <section
        className={
          isMainPage ? "header_nav_section" : "header_nav_section_none"
        }
      >
        <div className="section_navigation">
          <div
            className="navigation_item section_navigation_item1"
            onClick={() => handleNavigate("/MathTestReact/allTest")}
          >
            <h5 className="text-2xl">Переглянути тести</h5>
          </div>
          <div
            className="navigation_item section_navigation_item2"
            onClick={() => handleNavigate("/MathTestReact/study")}
          >
            <h5 className="text-2xl">Додати тест</h5>
          </div>
          <div
            className="navigation_item section_navigation_item3"
            onClick={() => handleNavigate("/MathTestReact/student")}
          >
            <h5 className="text-2xl">Учні</h5>
          </div>
        </div>

        <article className="header_article">
          <div className="article_text">
            <h1 className="text-center my-1 leading-relaxed ≈ 1.625">
              Математика навколо нас
            </h1>
            <p className="main-text-article my-5 text-xl leading-relaxed ≈ 1.625">
              Математика - це не лише формули та задачі. Вона живе в музиці,
              мистецтві, природі та технологіях. Це мова, якою описується світ.
              Ми покажемо, як зробити математику цікавою та зрозумілою.
            </p>
          </div>
        </article>
      </section>

      {/* ---MoBILE--- */}
      <nav
        id="mobile-header-navigation"
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
      {/* ---MoBILE--- */}
    </header>
  );
};

export default Header;
