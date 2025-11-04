import { NavLink } from "react-router-dom";

import "./header.css";
import logo from "/logo.svg";

const Header = () => {
  return (
    <div className="box_header">
      <header className="header">
        <NavLink to="/main">
          <img className="logo" src={logo} alt="logo" />
        </NavLink>

        <div className="header_navigation">
          <NavLink to="/allTest">
            <div className="header_navigation_item">
              <h5 className="header_navigation_item_h">Переглянути тести</h5>
            </div>
          </NavLink>

          <NavLink to="/newVariant">
            <div className="header_navigation_item">
              <h5 className="header_navigation_item_h">Додати тест</h5>
            </div>
          </NavLink>

          <NavLink to="/students">
            <div className="header_navigation_item">
              <h5 className="header_navigation_item_h">Учні</h5>
            </div>
          </NavLink>

          {/* <NavLink to="/account/login">
            <div className="header_log_in">
              <h4 className="header_navigation_item_h">Log in</h4>
            </div>
          </NavLink> */}
        </div>
      </header>
    </div>
  );
};

export default Header;
