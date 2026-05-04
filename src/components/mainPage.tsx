import "./mainPage.css";
import section3RightImg from "/section3_right.svg";

const MainPage = (props: { navigate: (path: string) => void }) => {
  return (
    <>
      <section className="section1">
        <div className="container_for_article">
          <div className="section1_navigation">
            <div
              className="section1_navigation_item"
              onClick={() => props.navigate("/MathTestReact/allTest")}
            >
              <h5 className="section1_navigation_item_h">Переглянути тести</h5>
            </div>
            <div
              className="section1_navigation_item"
              onClick={() => props.navigate("/MathTestReact/study")}
            >
              <h5 className="section1_navigation_item_h">Додати тест</h5>
            </div>
            <div
              className="section1_navigation_item"
              onClick={() => props.navigate("/MathTestReact/student")}
            >
              <h5 className="section1_navigation_item_h">Учні</h5>
            </div>
            <article className="article_about_math">
              <h2 className="text-center my-1">Математика навколо нас</h2>
              <p className="main-text-article my-5">
                Математика - це не лише формули та задачі. Вона живе в музиці,
                мистецтві, природі та технологіях. Це мова, якою описується
                світ. Ми покажемо, як зробити математику цікавою та зрозумілою.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* <section className="section2">
        <Card navigate={props.navigate}></Card>
        <Card navigate={props.navigate}></Card>
        <Card navigate={props.navigate}></Card>
        <Card navigate={props.navigate}></Card>
      </section> */}

      <section className="section3">
        <div className="section3_left_conteiner">
          <span className="section3_article">
            <h3>У нас на сайті ви зможете:</h3>
            <ul className="section3_list">
              <li>Перевірити свої знання</li>
              <p className="section3_list_text">
                Пройдіть інтерактивні тести, щоб оцінити рівень своїх знань і
                знайти слабкі місця.
              </p>
              <li>Зрозуміти складні теми</li>
              <p className="section3_list_text">
                Наші конспекти створені так, щоб пояснювати навіть найскладніші
                теми простими словами.
              </p>
              <li>Підготуватися до іспитів</li>
              <p className="section3_list_text">
                Використовуйте наші тематичні підбірки матеріалів, щоб успішно
                скласти ЗНО, ДПА чи будь-який інший іспит.
              </p>
              <li>Отримати індивідуальну допомогу</li>
              <p className="section3_list_text">
                Наші досвідчені репетитори допоможуть вам розібратися з темами,
                які викликають труднощі, та підвищити успішність.
              </p>
            </ul>
          </span>
        </div>
        <div className="section3_conteiner_right">
          <img
            className="section3_img"
            src={section3RightImg}
            alt="Математичні матеріали"
          ></img>
        </div>
      </section>
    </>
  );
};

export default MainPage;
