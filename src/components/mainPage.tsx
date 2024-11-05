import "./mainPage.css";

const MainPage = (props: { navigate: (path: string) => void }) => {
  return (
    <div className="main_page">
      <div className="articles">
        <article className="article1" onClick={() => props.navigate("/tests")}>
          <div className="article_description">
            <h2
              style={{
                margin: "10px 0",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              Тести
            </h2>
            <p style={{ margin: "10px 0" }}>Тестування для перевірки знань</p>
          </div>
        </article>
      </div>
    </div>
  );
};
export default MainPage;
