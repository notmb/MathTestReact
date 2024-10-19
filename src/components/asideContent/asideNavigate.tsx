import "./asideNavigate.css";

const AsideNavigate = (prop: { navigate: (path: string) => void }) => {
  return (
    <div className="aside_navigate">
      <div onClick={() => prop.navigate("/createtask")}>
        <p>Створити завдання</p>
      </div>
      <div onClick={() => prop.navigate("/test")}>
        <p>Тести</p>
      </div>
    </div>
  );
};
export default AsideNavigate;
