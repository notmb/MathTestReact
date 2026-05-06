import "./mainPage.css";
import section3RightImg from "/section3_right.svg";

const MainPage = () => {
  return (
    <>
      <section className="main_page_section">
        <div className="main_page_section_left_conteiner">
          <span className="main_page_section_article">
            <h3>У нас на сайті ви зможете:</h3>
            <ul className="main_page_section_list">
              <li>Перевірити свої знання</li>
              <p className="main_page_section_list_text">
                Пройдіть інтерактивні тести, щоб оцінити рівень своїх знань і
                знайти слабкі місця.
              </p>
              <li>Зрозуміти складні теми</li>
              <p className="main_page_section_list_text">
                Наші конспекти створені так, щоб пояснювати навіть найскладніші
                теми простими словами.
              </p>
              <li>Підготуватися до іспитів</li>
              <p className="main_page_section_list_text">
                Використовуйте наші тематичні підбірки матеріалів, щоб успішно
                скласти ЗНО, ДПА чи будь-який інший іспит.
              </p>
              <li>Отримати індивідуальну допомогу</li>
              <p className="main_page_section_list_text">
                Наші досвідчені репетитори допоможуть вам розібратися з темами,
                які викликають труднощі, та підвищити успішність.
              </p>
            </ul>
          </span>
        </div>
        <div className="main_page_section_conteiner_right">
          <img
            className="main_page_section_img"
            src={section3RightImg}
            alt="Математичні матеріали"
          ></img>
        </div>
      </section>
    </>
  );
};

export default MainPage;
