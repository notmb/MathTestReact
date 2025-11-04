import "./mainPage.css";
import ikon7 from "/ikon7.svg";
import section3RightImg from "/section3_right.svg";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const goToAllTests = () => {
    navigate("/allTest");
  };
  return (
    <>
      <section className="section1">
        <div className="container_for_article">
          <article className="article_about_math">
            <h2>Математика навколо нас</h2>
            <p style={{ margin: "20px 0" }}>
              Математика — це не лише формули та задачі. Вона живе в музиці,
              мистецтві, природі та технологіях. Це мова, якою описується світ.
              Ми покажемо, як зробити математику цікавою та зрозумілою.
            </p>
          </article>
        </div>
        <div className="conteiner_for_img"></div>
      </section>
      <section className="section2">
        {/* <Card navigate={props.navigate}></Card>
        <Card navigate={props.navigate}></Card>
        <Card navigate={props.navigate}></Card>
        <Card navigate={props.navigate}></Card> */}
      </section>
      <section className="section3">
        <div className="section3_left_conteiner">
          <span className="section3_article">
            <h3>У нас на сайті ви зможете:</h3>
            <ul className="section3_list">
              <li>Перевірити свої знання</li>
              <p className="section3_list_text">
                Пройдіть інтерактивні тести, щоб оцінити рівень своїх знань і
                знайти слабкі місця
              </p>
              <li>Зрозуміти складні теми</li>
              <p className="section3_list_text">
                Наші конспекти створені так, щоб пояснювати навіть найскладніші
                теми простими словами
              </p>
              <li>Підготуватися до іспитів</li>
              <p className="section3_list_text">
                Використовуйте наші тематичні підбірки матеріалів, щоб успішно
                скласти ЗНО, ДПА чи будь-який інший іспит.
              </p>
              <li>Отримати індивідуальну допомогу</li>
              <p className="section3_list_text">
                Наші досвідчені репетитори допоможуть вам розібратися з темами,
                які викликають труднощі, та підвищити успішність
              </p>
            </ul>
          </span>
        </div>
        <div className="section3_conteiner_right">
          <img
            className="section3_img"
            src={section3RightImg}
            alt="image"
          ></img>
        </div>
      </section>
    </>
  );
};
export default MainPage;

//

//

//

const Card = (props: { navigate: (path: string) => void }) => {
  return (
    <div className="card" onClick={() => props.navigate("/tests")}>
      <img className="section2_img" src={ikon7} alt="ikon"></img>
      <h2
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          color: "#1a5599",
        }}
      >
        Тест
      </h2>
      <p style={{ textAlign: "center", color: "#1a5599" }}>
        Визначити рівень знань
      </p>
    </div>
  );
};
