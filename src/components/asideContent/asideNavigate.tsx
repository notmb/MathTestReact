import "./asideNavigate.css";

const AsideNavigate = (prop: { navigate: (path: string) => void }) => {
  return (
    <div className="aside_navigate">
      <div onClick={() => prop.navigate("/createtask")}>
        <p className="aside_navigate_item">Додати завдання</p>
      </div>
      <div onClick={() => prop.navigate("/test")}>
        <p className="aside_navigate_item">Тести</p>
      </div>
    </div>
  );
};
export default AsideNavigate;
