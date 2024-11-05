import "./header.css";

const Header = (prop: { navigate: (path: string) => void }) => {
  return (
    <header className="header">
      <img
        className="logo"
        src="/logo.svg"
        onClick={() => prop.navigate("/main")}
      ></img>
      <div className="header_navigation">
        <div
          className="header_navigation_item"
          onClick={() => prop.navigate("/tests")}
        >
          <h5 className="header_navigation_item_h">Тести</h5>
        </div>
        <div
          className="header_navigation_item"
          onClick={() => prop.navigate("/conspectus")}
        >
          <h5 className="header_navigation_item_h">Конспекти</h5>
        </div>
        <div
          className="header_navigation_item"
          onClick={() => prop.navigate("/study")}
        >
          <h5 className="header_navigation_item_h">Навчання</h5>
        </div>
      </div>
      <div className="header_log_in">
        <h4 className="header_navigation_item_h">Log in</h4>
      </div>
    </header>
  );
};

export default Header;
