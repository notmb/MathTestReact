import "./footer.css";
import logo from "/logo.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_brand">
        <img className="footer_logo" src={logo} alt="MathTest" />
      </div>

      <div className="footer_column">
        <h4>Контакти</h4>
        <ul className="footer_list">
          <li>
            <a className="footer_link" href="mailto:myemail@gmail.com">
              myemail@gmail.com
            </a>
          </li>
          <li>
            <a className="footer_link" href="#">
              Instagram
            </a>
          </li>
          <li>
            <a className="footer_link" href="#">
              Telegram
            </a>
          </li>
        </ul>
      </div>

      <div className="footer_column">
        <h4>Інформація</h4>
        <ul className="footer_list">
          <li>
            <a className="footer_link" href="#">
              Про нас
            </a>
          </li>
          <li>
            <a className="footer_link" href="#">
              Допомога
            </a>
          </li>
          <li>
            <a className="footer_link" href="#">
              Співпраця
            </a>
          </li>
          <li>
            <a className="footer_link" href="#">
              Політика конфіденційності
            </a>
          </li>
        </ul>
      </div>

      <div className="footer_bottom">
        <span>MathTestReact</span>
        <span>Навчання без зайвого шуму</span>
      </div>
    </footer>
  );
};

export default Footer;
