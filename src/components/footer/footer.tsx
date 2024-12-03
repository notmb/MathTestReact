import "./footer.css";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer_conteiners">
          <h4>Контакти</h4>
          <ul className="footer_list">
            <li>myemail@gmail.com</li>
            <li>
              <a className="fotter_link" href="#">
                Instagram
              </a>
            </li>
            <li>
              <a className="fotter_link" href="#">
                Telegram
              </a>
            </li>
          </ul>
        </div>
        <div className="footer_conteiners">
          <h4>Інформація</h4>
          <ul className="footer_list">
            <li>
              <a className="fotter_link" href="#">
                Про нас
              </a>
            </li>
            <li>
              <a className="fotter_link" href="#">
                Допомога
              </a>
            </li>
            <li>
              <a className="fotter_link" href="#">
                Співпраця
              </a>
            </li>
            <li>
              <a className="fotter_link" href="#">
                Політика конфіденційності
              </a>
            </li>
          </ul>
        </div>
        <div className="footer_conteiners"></div>
        <div className="footer_conteiner_logo">
          <img className="footer_logo" src="/logo.svg"></img>
        </div>
      </footer>
    </>
  );
};

export default Footer;
