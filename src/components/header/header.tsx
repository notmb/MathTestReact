import "./header.css";

import logo from "/logo.svg";

const Header = (prop: { navigate: (path: string) => void }) => {
  return (
    <div className="box_header">
      <header className="header">
        <img
          className="logo"
          src={logo}
          onClick={() => prop.navigate("/MathTestReact/main")}
        ></img>

        <div className="header_navigation">
          <div
            className="header_navigation_item"
            onClick={() => prop.navigate("/MathTestReact/tests")}
          >
            <h5 className="header_navigation_item_h">Тести</h5>
          </div>
          <div
            className="header_navigation_item"
            onClick={() => prop.navigate("/MathTestReact/conspectus")}
          >
            <h5 className="header_navigation_item_h">Конспекти</h5>
          </div>
          <div
            className="header_navigation_item"
            onClick={() => prop.navigate("/MathTestReact/study")}
          >
            <h5 className="header_navigation_item_h">Навчання</h5>
          </div>
        </div>
        <div
          className="header_log_in"
          onClick={() => prop.navigate("/MathTestReact/account/login")}
        >
          <h4 className="header_navigation_item_h">Log in</h4>
        </div>
      </header>
    </div>
  );
};

export default Header;
