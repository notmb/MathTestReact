import "./header.css";

import logo from "/logo.svg";

const Header = (props: { navigate: (path: string) => void }) => {
  return (
    <div className="box_header">
      <header className="header">
        <img
          className="logo"
          src={logo}
          onClick={() => props.navigate("/MathTestReact/main")}
        ></img>

        <div className="header_navigation">
          {/* <div
            className="header_navigation_item"
            onClick={() => props.navigate("/MathTestReact/tests")}
          >
            <h5 className="header_navigation_item_h">Тести</h5>
          </div> */}
          <div
            className="header_navigation_item"
            onClick={() => props.navigate("/MathTestReact/allTest")}
          >
            <h5 className="header_navigation_item_h">Переглянути тести</h5>
          </div>
          <div
            className="header_navigation_item"
            onClick={() => props.navigate("/MathTestReact/study")}
          >
            <h5 className="header_navigation_item_h">Додати тест</h5>
          </div>
        </div>
        <div
          className="header_log_in"
          onClick={() => props.navigate("/MathTestReact/account/login")}
        >
          <h4 className="header_navigation_item_h">Log in</h4>
        </div>
      </header>
    </div>
  );
};

export default Header;
